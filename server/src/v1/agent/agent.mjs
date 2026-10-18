import { DynamicStructuredTool } from '@langchain/core/tools';
import { ChatOllama } from '@langchain/ollama';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { z } from 'zod';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

const MONGO_URI = process.env.DATABASE || 'mongodb://127.0.0.1:27017/ecom-mern';

export async function dbConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  return await mongoose.connect(MONGO_URI);
}

// Dynamically obtain Product, Category, and Sub models
let Product, Category, Sub;

async function getModels() {
  await dbConnect();

  if (mongoose.models.Product) {
    Product = mongoose.models.Product;
  } else {
    const prodMod = await import('../models/product.js');
    Product = prodMod.default || mongoose.model('Product');
  }

  if (mongoose.models.Category) {
    Category = mongoose.models.Category;
  } else {
    const catMod = await import('../models/category.js');
    Category = catMod.default || mongoose.model('Category');
  }

  if (mongoose.models.Sub) {
    Sub = mongoose.models.Sub;
  } else {
    try {
      const subMod = await import('../models/sub.js');
      Sub = subMod.default || mongoose.model('Sub');
    } catch (e) {
      Sub = mongoose.models.Sub;
    }
  }

  return { Product, Category, Sub };
}

// Helper to normalize search synonyms (e.g., "mobile phone" -> "smartphones")
function expandQuery(query) {
  let expanded = query;
  if (/mobile|phone|cellphone|cell/i.test(query)) {
    expanded += ' smartphone iphone android';
  }
  if (/laptop|notebook/i.test(query)) {
    expanded += ' macbook pc';
  }
  return expanded;
}

export const productSearchTool = new DynamicStructuredTool({
  name: 'search_products',
  description: 'Search the store for products by name, description, category, subcategory, or brand.',
  schema: z.object({
    query: z.string().min(1).describe('Product name, keyword, category, or subcategory name'),
  }),

  func: async ({ query }) => {
    await dbConnect();
    const { Product, Category, Sub } = await getModels();

    const searchQuery = expandQuery(query);
    const words = searchQuery.split(/\s+/).filter(Boolean);
    const regexConditions = words.map(w => new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));

    // Find matching categories and subcategories
    let matchingCatIds = [];
    let matchingSubIds = [];

    try {
      const cats = await Category.find({
        $or: regexConditions.map(r => ({ name: {$regex: r } }))
      }).select('_id').lean();
      matchingCatIds = cats.map(c => c._id);
    } catch (e) {}

    try {
      if (Sub) {
        const subs = await Sub.find({
          $or: regexConditions.map(r => ({ name: {$regex: r } }))
        }).select('_id').lean();
        matchingSubIds = subs.map(s => s._id);
      }
    } catch (e) {}

    // Build product filter matching seeded database fields
    const filter = {
      $or: [
        ...regexConditions.map(r => ({ title: { $regex: r } })),
        ...regexConditions.map(r => ({ description: { $regex: r } })),
        ...regexConditions.map(r => ({ brand: { $regex: r } })),
        ...(matchingCatIds.length ? [{ category: { $in: matchingCatIds } }] : []),
        ...(matchingSubIds.length ? [{ subs: { $in: matchingSubIds } }] : [])
      ],
    };

    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('subs', 'name')
      .select('title description category subs price brand slug images quantity')
      .limit(10)
      .lean();

    if (!products || products.length === 0) {
      return `No products found matching "${query}".`;
    }

    const formatted = products.map(p => ({
      title: p.title,
      description: p.description,
      category: p.category?.name || 'General',
      subCategories: Array.isArray(p.subs) ? p.subs.map(s => s.name).join(', ') : '',
      price: p.price,
      brand: p.brand,
      slug: p.slug,
      image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '',
      inStock: p.quantity > 0,
    }));

    return JSON.stringify(formatted);
  },
});

export const priceSearchTool = new DynamicStructuredTool({
  name: 'search_by_price_range',
  description: 'Find products within a minimum and maximum price range.',
  schema: z.object({
    minPrice: z.number().optional().describe('Minimum product price'),
    maxPrice: z.number().optional().describe('Maximum product price'),
  }),
  func: async ({ minPrice = 0, maxPrice = Infinity }) => {
    await dbConnect();
    const { Product } = await getModels();

    const effectiveMax = maxPrice === Infinity ? 100000 : maxPrice;
    const products = await Product.find({
      price: { $gte: minPrice,$lte: effectiveMax }
    })
      .populate('category', 'name')
      .select('title name price category subCategory brand slug images quantity')
      .limit(10)
      .lean();

    if (!products || products.length === 0) {
      return `No products found in this price range ($${minPrice} - $${effectiveMax}).`;
    }

    const formatted = products.map(p => ({
      name: p.title || p.name,
      title: p.title || p.name,
      price: p.price,
      category: p.category?.name || 'General',
      subCategory: p.subCategory || '',
      brand: p.brand,
      slug: p.slug,
      image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '',
      inStock: p.quantity > 0,
    }));

    return JSON.stringify(formatted);
  },
});

export const llm = new ChatOllama({
  model: 'llama3.2:1b',
  baseUrl: 'http://localhost:11434',
  temperature: 0,
});

export const tools = [productSearchTool, priceSearchTool];

export const agentExecutor = createReactAgent({
  llm,
  tools,
  messageModifier: `You are a friendly, flexible AI Shopping Assistant for this E-Commerce store. 
You can handle general conversations, greetings, and casual questions, as well as product recommendations.
When users ask about products, categories, subcategories, prices, or descriptions, ALWAYS use the provided tools (search_products, search_by_price_range) to fetch real items from the database.
Format your responses nicely with product names, prices in USD ($), brands, descriptions, and categories/subcategories when available.
If a query is general chat (e.g. "hi", "how are you"), respond politely and helpfully without forcing a database lookup.`
});

// Direct search helper for attaching rich product cards to chat
export async function directSearch(query) {
  try {
    await dbConnect();
    const { Product, Category } = await getModels();
    const safe = (query || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
    if (!safe) return [];

    let matchingCatIds = [];
    try {
      const cats = await Category.find({
        $or: [
          { name: { $regex: safe,$options: 'i' } },
          { subCategory: { $regex: safe,$options: 'i' } }
        ]
      }).select('_id').lean();
      matchingCatIds = cats.map(c => c._id);
    } catch (e) {}

    const products = await Product.find({
      $or: [
        { title: { $regex: safe,$options: 'i' } },
        { description: { $regex: safe,$options: 'i' } },
        { brand: { $regex: safe,$options: 'i' } },
        { subCategory: { $regex: safe,$options: 'i' } },
        ...(matchingCatIds.length ? [{ category: { $in: matchingCatIds } }] : [])
      ]
    })
      .populate('category', 'name')
      .limit(6)
      .lean();

    return products.map(p => ({
      _id: p._id,
      title: p.title || p.name,
      slug: p.slug,
      price: p.price,
      description: p.description,
      category: p.category?.name || 'General',
      subCategory: p.subCategory || '',
      brand: p.brand,
      images: p.images || [],
      ratings: p.ratings || [],
      quantity: p.quantity,
    }));
  } catch (err) {
    console.error('directSearch error:', err);
    return [];
  }
}

export async function runAgent(userMessage) {
  try {
    // Add timeout safety to invoke
    const invokePromise = agentExecutor.invoke({
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI Agent timed out after 30 seconds')), 30000)
    );

    const response = await Promise.race([invokePromise, timeoutPromise]);
    const lastMessage = response.messages?.at(-1);
    let reply = lastMessage?.content ?? '';

    // If reply is an array of content blocks
    if (Array.isArray(reply)) {
      reply = reply.map(b => (typeof b === 'string' ? b : b.text || '')).join('\n');
    }

    return typeof reply === 'string' ? reply : JSON.stringify(reply);
  } catch (error) {
    console.error('runAgent error, falling back:', error.message);
    // Intelligent fallback using database search
    const results = await directSearch(userMessage);
    if (results.length > 0) {
      const itemsList = results.slice(0, 3).map(p => `• **${p.title}** - $${p.price} (${p.description.substring(0, 70)}...)`).join('\n');
      return `Here are some great products matching your request:\n\n${itemsList}\n\nYou can click on any card below to view details or add to cart!`;
    }
    return `I couldn't find specific products matching "${userMessage}". Browse our categories or try searching for laptops, phones, audio, or accessories!`;
  }
}