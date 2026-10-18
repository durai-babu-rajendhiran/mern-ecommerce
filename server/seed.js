const mongoose = require("mongoose");
const slugify = require("slugify");
require("dotenv").config();

const Category = require("./src/v1/models/category");
const Sub = require("./src/v1/models/sub");
const Product = require("./src/v1/models/product");
const User = require("./src/v1/models/user");

const MONGO_URI = process.env.DATABASE || "mongodb://127.0.0.1:27017/ecom-mern";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing
    await Category.deleteMany({});
    await Sub.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create demo users
    const adminUser = await new User({
      name: "Admin User",
      email: "admin@demo.com",
      role: "admin",
    }).save();

    const customerUser = await new User({
      name: "John Doe",
      email: "customer@demo.com",
      role: "subscriber",
    }).save();

    console.log("Created users:", adminUser.email, customerUser.email);

    // Categories
    const catLaptops = await new Category({ name: "Laptops", slug: "laptops" }).save();
    const catSmartphones = await new Category({ name: "Smartphones", slug: "smartphones" }).save();
    const catTablets = await new Category({ name: "Tablets", slug: "tablets" }).save();
    const catAudio = await new Category({ name: "Audio", slug: "audio" }).save();
    const catAccessories = await new Category({ name: "Accessories", slug: "accessories" }).save();

    // Subcategories
    const subMac = await new Sub({ name: "Apple Mac", slug: "apple-mac", parent: catLaptops._id }).save();
    const subGaming = await new Sub({ name: "Gaming Laptops", slug: "gaming-laptops", parent: catLaptops._id }).save();
    const subUltrabook = await new Sub({ name: "Ultrabooks", slug: "ultrabooks", parent: catLaptops._id }).save();
    const subiPhone = await new Sub({ name: "iPhones", slug: "iphones", parent: catSmartphones._id }).save();
    const subAndroid = await new Sub({ name: "Android Flagships", slug: "android-flagships", parent: catSmartphones._id }).save();
    const subHeadphones = await new Sub({ name: "Headphones", slug: "headphones", parent: catAudio._id }).save();

    const products = [
      {
        title: "MacBook Pro 16 M3 Max",
        slug: slugify("MacBook Pro 16 M3 Max").toLowerCase(),
        description: "Apple MacBook Pro 16-inch with M3 Max chip, 36GB unified memory, 1TB SSD storage, Liquid Retina XDR display, space black finish.",
        price: 2499,
        category: catLaptops._id,
        subs: [subMac._id],
        quantity: 15,
        sold: 8,
        shipping: "Yes",
        color: "Black",
        brand: "Apple",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"],
        ratings: [{ star: 5, postedBy: customerUser._id }],
      },
      {
        title: "MacBook Air 15 M3",
        slug: slugify("MacBook Air 15 M3").toLowerCase(),
        description: "Thin and powerful Apple MacBook Air 15-inch with M3 chip, 16GB unified memory, 512GB SSD, all-day 18-hour battery life, midnight color.",
        price: 1299,
        category: catLaptops._id,
        subs: [subMac._id, subUltrabook._id],
        quantity: 25,
        sold: 14,
        shipping: "Yes",
        color: "Blue",
        brand: "Apple",
        images: ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80"],
        ratings: [{ star: 5, postedBy: customerUser._id }],
      },
      {
        title: "ASUS ROG Zephyrus G16",
        slug: slugify("ASUS ROG Zephyrus G16").toLowerCase(),
        description: "Ultra-thin gaming laptop with Intel Core Ultra 9, NVIDIA GeForce RTX 4080, 240Hz 2.5K OLED ROG Nebula Display, 32GB DDR5 RAM, 1TB SSD.",
        price: 1999,
        category: catLaptops._id,
        subs: [subGaming._id],
        quantity: 10,
        sold: 6,
        shipping: "Yes",
        color: "Silver",
        brand: "ASUS",
        images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80"],
        ratings: [{ star: 4, postedBy: customerUser._id }],
      },
      {
        title: "Lenovo Legion Pro 7i",
        slug: slugify("Lenovo Legion Pro 7i").toLowerCase(),
        description: "AI-tuned gaming powerhouse with Intel Core i9-14900HX, RTX 4090 GPU, Coldfront 5.0 vapor chamber cooling, 32GB RAM, 2TB PCIe 4.0 SSD.",
        price: 2199,
        category: catLaptops._id,
        subs: [subGaming._id],
        quantity: 8,
        sold: 5,
        shipping: "Yes",
        color: "Black",
        brand: "Lenovo",
        images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80"],
        ratings: [{ star: 5, postedBy: customerUser._id }],
      },
      {
        title: "Lenovo ThinkPad X1 Carbon Gen 12",
        slug: slugify("Lenovo ThinkPad X1 Carbon Gen 12").toLowerCase(),
        description: "Legendary ultralight business laptop with carbon-fiber chassis, Intel Core Ultra 7 with Intel vPro, 14-inch 2.8K OLED display, 16GB RAM.",
        price: 1499,
        category: catLaptops._id,
        subs: [subUltrabook._id],
        quantity: 20,
        sold: 11,
        shipping: "Yes",
        color: "Black",
        brand: "Lenovo",
        images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80"],
        ratings: [{ star: 5, postedBy: customerUser._id }],
      },
      {
        title: "iPhone 16 Pro Max 256GB",
        slug: slugify("iPhone 16 Pro Max 256GB").toLowerCase(),
        description: "Titanium design with A18 Pro chip, 48MP Fusion camera system with 5x telephoto, Camera Control button, stunning 6.9-inch Super Retina XDR.",
        price: 1199,
        category: catSmartphones._id,
        subs: [subiPhone._id],
        quantity: 30,
        sold: 22,
        shipping: "Yes",
        color: "Black",
        brand: "Apple",
        images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80"],
        ratings: [{ star: 5, postedBy: customerUser._id }],
      },
      {
        title: "Samsung Galaxy S24 Ultra",
        slug: slugify("Samsung Galaxy S24 Ultra").toLowerCase(),
        description: "Galaxy AI powered flagship with built-in S Pen, Titanium frame, 200MP camera with 100x Space Zoom, Snapdragon 8 Gen 3 for Galaxy, 512GB.",
        price: 1299,
        category: catSmartphones._id,
        subs: [subAndroid._id],
        quantity: 20,
        sold: 18,
        shipping: "Yes",
        color: "Silver",
        brand: "Samsung",
        images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80"],
        ratings: [{ star: 5, postedBy: customerUser._id }],
      },
      {
        title: "Microsoft Surface Laptop 7",
        slug: slugify("Microsoft Surface Laptop 7").toLowerCase(),
        description: "Copilot+ PC with Snapdragon X Elite processor, lightning fast AI capabilities, 13.8-inch PixelSense touchscreen display, sapphire blue.",
        price: 999,
        category: catLaptops._id,
        subs: [subUltrabook._id],
        quantity: 18,
        sold: 9,
        shipping: "Yes",
        color: "Blue",
        brand: "Microsoft",
        images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80"],
        ratings: [{ star: 4, postedBy: customerUser._id }],
      },
      {
        title: "Apple iPad Pro 13 M4",
        slug: slugify("Apple iPad Pro 13 M4").toLowerCase(),
        description: "Thinnest Apple product ever at 5.1mm with breakthrough Ultra Retina XDR Tandem OLED display, powerhouse M4 chip, Apple Pencil Pro support.",
        price: 1299,
        category: catTablets._id,
        subs: [subMac._id],
        quantity: 14,
        sold: 7,
        shipping: "Yes",
        color: "Silver",
        brand: "Apple",
        images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80"],
        ratings: [{ star: 5, postedBy: customerUser._id }],
      },
      {
        title: "Samsung Galaxy Tab S9 Ultra",
        slug: slugify("Samsung Galaxy Tab S9 Ultra").toLowerCase(),
        description: "Massive 14.6-inch Dynamic AMOLED 2X display, IP68 water & dust resistance, bundled S Pen, Snapdragon 8 Gen 2, quad stereo speakers by AKG.",
        price: 1099,
        category: catTablets._id,
        subs: [subAndroid._id],
        quantity: 12,
        sold: 5,
        shipping: "Yes",
        color: "Black",
        brand: "Samsung",
        images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80"],
        ratings: [{ star: 4, postedBy: customerUser._id }],
      },
      {
        title: "Apple AirPods Max",
        slug: slugify("Apple AirPods Max").toLowerCase(),
        description: "Computational audio, industry-leading Active Noise Cancellation, Transparency mode, personalized spatial audio with dynamic head tracking.",
        price: 549,
        category: catAudio._id,
        subs: [subHeadphones._id],
        quantity: 25,
        sold: 19,
        shipping: "Yes",
        color: "Silver",
        brand: "Apple",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
        ratings: [{ star: 5, postedBy: customerUser._id }],
      },
      {
        title: "Samsung Galaxy Buds3 Pro",
        slug: slugify("Samsung Galaxy Buds3 Pro").toLowerCase(),
        description: "Blade design with Blade Lights, Hi-Fi 24-bit audio, adaptive noise control with Galaxy AI real-time interpreter integration.",
        price: 249,
        category: catAudio._id,
        subs: [subHeadphones._id],
        quantity: 35,
        sold: 16,
        shipping: "Yes",
        color: "White",
        brand: "Samsung",
        images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"],
        ratings: [{ star: 4, postedBy: customerUser._id }],
      }
    ];

    for (const p of products) {
      await new Product(p).save();
    }

    console.log(`Successfully seeded ${products.length} products!`);
    await mongoose.disconnect();
    console.log("Database connection closed. Seed complete!");
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
