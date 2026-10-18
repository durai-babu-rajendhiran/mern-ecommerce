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

// Ensure DB Connection
export async function dbConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  return await mongoose.connect(MONGO_URI);
}

// Dynamically obtain Product and Category models from Mongoose
let Product;
let Category;

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

  return { Product, Category };
}

export const productSearchTool = new DynamicStructuredTool({
  name: 'search_products',
  description: 'Search the store for products by name, description, or category.',
  schema: z.object({
    query: z.string().min(1).describe('Product name or keyword'),
  }),

  func: async ({ query }) => {
    await dbConnect();
    const { Product, Category } = await getModels();

    // Escape regex special characters in user input.
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Also look up category IDs matching query
    let matchingCatIds = [];
    try {
      const cats = await Category.find({ name: { $regex: safeQuery, $options: 'i' } }).select('_id').lean();
      matchingCatIds = cats.map(c => c._id);
    } catch (e) {}

    const filter = {
      $or: [
        { title: { $regex: safeQuery, $options: 'i' } },
        { name: { $regex: safeQuery, $options: 'i' } },
        { description: { $regex: safeQuery, $options: 'i' } },
        { brand: { $regex: safeQuery, $options: 'i' } },
        ...(matchingCatIds.length ? [{ category: { $in: matchingCatIds } }] : [])
      ],
    };

    const products = await Product.find(filter)
      .populate('category', 'name')
      .select('title name description category price brand slug images quantity ratings')
      .limit(10)
      .lean();

    if (!products || products.length === 0) {
      return `No products found matching "${query}".`;
    }

    const formatted = products.map(p => ({
      name: p.title || p.name,
      title: p.title || p.name,
      description: p.description,
      category: p.category?.name || 'Electronics',
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
      price: { $gte: minPrice, $lte: effectiveMax }
    })
      .populate('category', 'name')
      .select('title name price category brand slug images quantity')
      .limit(10)
      .lean();

    if (!products || products.length === 0) {
      return `No products found in this price range ($${minPrice} - $${effectiveMax}).`;
    }

    const formatted = products.map(p => ({
      name: p.title || p.name,
      title: p.title || p.name,
      price: p.price,
      category: p.category?.name || 'Electronics',
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
  messageModifier: `You are the friendly, helpful AI Shopping Assistant for this E-Commerce store.
Always use the provided tools (search_products, search_by_price_range) to look up real store products, prices, and stock from our database.
Format your responses nicely with product names, prices in USD ($), brands, and descriptions.
Help customers choose the best items according to their budget and needs.`
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
      const cats = await Category.find({ name: { $regex: safe, $options: 'i' } }).select('_id').lean();
      matchingCatIds = cats.map(c => c._id);
    } catch (e) {}

    const products = await Product.find({
      $or: [
        { title: { $regex: safe, $options: 'i' } },
        { description: { $regex: safe, $options: 'i' } },
        { brand: { $regex: safe, $options: 'i' } },
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
      category: p.category?.name || 'Electronics',
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
