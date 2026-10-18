
const mongoose = require("mongoose");
const slugify = require("slugify");
require("dotenv").config();

const Category = require("./src/v1/models/category");
const Sub = require("./src/v1/models/sub");
const Product = require("./src/v1/models/product");
const User = require("./src/v1/models/user");
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const MONGO_URI =process.env.DATABASE || 'mongodb://127.0.0.1:27017/ecom-mern';

if (!MONGO_URI) {
  throw new Error("Please configure DATABASE in your .env file");
}

// 10 categories, with 2 subcategories each
const categoryData = [
  {
    name: "Laptops",
    subs: ["Apple Mac", "Gaming Laptops"],
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
  },
  {
    name: "Smartphones",
    subs: ["iPhones", "Android Phones"],
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
  },
  {
    name: "Tablets",
    subs: ["Apple iPads", "Android Tablets"],
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
  },
  {
    name: "Audio",
    subs: ["Headphones", "Earbuds"],
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  },
  {
    name: "Accessories",
    subs: ["Keyboards", "Computer Accessories"],
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80",
  },
  {
    name: "Gaming",
    subs: ["Gaming Consoles", "Gaming Controllers"],
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80",
  },
  {
    name: "Monitors",
    subs: ["Gaming Monitors", "Office Monitors"],
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
  },
  {
    name: "Cameras",
    subs: ["Digital Cameras", "Action Cameras"],
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
  },
  {
    name: "Smart Home",
    subs: ["Smart Speakers", "Home Security"],
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
  },
  {
    name: "Wearables",
    subs: ["Smart Watches", "Fitness Trackers"],
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  },
];

// Each item: title, brand, price in USD, color
const catalog = {
  Laptops: [
    ["MacBook Air 13 M3", "Apple", 1099, "Silver"],
    ["MacBook Air 15 M3", "Apple", 1299, "Midnight"],
    ["MacBook Pro 14 M4", "Apple", 1599, "Black"],
    ["MacBook Pro 16 M4 Pro", "Apple", 2499, "Space Black"],
    ["ROG Zephyrus G16", "ASUS", 1999, "Gray"],
    ["ROG Strix G18", "ASUS", 2199, "Black"],
    ["Legion Pro 7i", "Lenovo", 2299, "Black"],
    ["ThinkPad X1 Carbon", "Lenovo", 1699, "Black"],
    ["XPS 14", "Dell", 1799, "Platinum"],
    ["Surface Laptop 7", "Microsoft", 1199, "Blue"],
  ],

  Smartphones: [
    ["iPhone 16 Pro Max 256GB", "Apple", 1199, "Desert Titanium"],
    ["iPhone 16 Pro 128GB", "Apple", 999, "Black Titanium"],
    ["iPhone 16 128GB", "Apple", 799, "Ultramarine"],
    ["iPhone 15 128GB", "Apple", 699, "Blue"],
    ["Galaxy S24 Ultra 256GB", "Samsung", 1299, "Titanium Gray"],
    ["Galaxy S24 Plus 256GB", "Samsung", 999, "Violet"],
    ["Galaxy A55 5G", "Samsung", 449, "Navy"],
    ["Pixel 9 Pro 256GB", "Google", 1099, "Obsidian"],
    ["OnePlus 12 256GB", "OnePlus", 799, "Emerald"],
    ["Nothing Phone 2a", "Nothing", 399, "Black"],
  ],

  Tablets: [
    ["iPad Pro 13 M4", "Apple", 1299, "Silver"],
    ["iPad Pro 11 M4", "Apple", 999, "Space Black"],
    ["iPad Air 13 M2", "Apple", 799, "Blue"],
    ["iPad Air 11 M2", "Apple", 599, "Purple"],
    ["iPad mini", "Apple", 499, "Starlight"],
    ["Galaxy Tab S10 Ultra", "Samsung", 1199, "Gray"],
    ["Galaxy Tab S9 FE", "Samsung", 449, "Mint"],
    ["Lenovo Tab P12", "Lenovo", 349, "Storm Gray"],
    ["OnePlus Pad 2", "OnePlus", 549, "Nimbus Gray"],
    ["Surface Pro 11", "Microsoft", 999, "Platinum"],
  ],

  Audio: [
    ["AirPods Max", "Apple", 549, "Silver"],
    ["AirPods Pro 2", "Apple", 249, "White"],
    ["AirPods 4", "Apple", 129, "White"],
    ["WH-1000XM5", "Sony", 399, "Black"],
    ["WH-CH720N", "Sony", 149, "Blue"],
    ["QuietComfort Ultra", "Bose", 429, "Black"],
    ["QuietComfort Headphones", "Bose", 349, "White"],
    ["Galaxy Buds3 Pro", "Samsung", 249, "Silver"],
    ["Momentum 4 Wireless", "Sennheiser", 349, "Black"],
    ["JBL Live 770NC", "JBL", 199, "Blue"],
  ],

  Accessories: [
    ["Magic Keyboard", "Apple", 99, "White"],
    ["Magic Mouse", "Apple", 79, "White"],
    ["MX Master 3S", "Logitech", 99, "Graphite"],
    ["MX Keys S", "Logitech", 109, "Graphite"],
    ["K380 Bluetooth Keyboard", "Logitech", 39, "Rose"],
    ["G Pro X Superlight", "Logitech", 159, "Black"],
    ["Mechanical Keyboard K2", "Keychron", 89, "Gray"],
    ["USB-C Hub 8-in-1", "Anker", 59, "Gray"],
    ["100W USB-C Charger", "Anker", 49, "White"],
    ["Portable SSD 2TB", "Samsung", 179, "Black"],
  ],

  Gaming: [
    ["PlayStation 5 Slim", "Sony", 499, "White"],
    ["PlayStation 5 Digital", "Sony", 449, "White"],
    ["Xbox Series X", "Microsoft", 499, "Black"],
    ["Xbox Series S", "Microsoft", 299, "White"],
    ["Nintendo Switch OLED", "Nintendo", 349, "White"],
    ["Nintendo Switch Lite", "Nintendo", 199, "Turquoise"],
    ["DualSense Wireless Controller", "Sony", 69, "White"],
    ["Xbox Wireless Controller", "Microsoft", 59, "Black"],
    ["Elite Series 2 Controller", "Microsoft", 179, "Black"],
    ["Pro Controller", "Nintendo", 69, "Black"],
  ],

  Monitors: [
    ["Odyssey OLED G8 34-inch", "Samsung", 999, "Black"],
    ["Odyssey G7 32-inch", "Samsung", 699, "Black"],
    ["UltraGear OLED 27-inch", "LG", 899, "Black"],
    ["UltraGear 32-inch QHD", "LG", 449, "Black"],
    ["Studio Display 27-inch", "Apple", 1599, "Silver"],
    ["ProArt 27-inch 4K", "ASUS", 599, "Black"],
    ["ROG Swift 32-inch OLED", "ASUS", 1299, "Black"],
    ["UltraSharp 27-inch 4K", "Dell", 579, "Silver"],
    ["P2723QE 27-inch", "Dell", 399, "Black"],
    ["M27Q 27-inch Gaming", "Gigabyte", 329, "Black"],
  ],

  Cameras: [
    ["EOS R6 Mark II", "Canon", 2499, "Black"],
    ["EOS R50", "Canon", 799, "Black"],
    ["EOS R8", "Canon", 1499, "Black"],
    ["Alpha A7 IV", "Sony", 2499, "Black"],
    ["Alpha A6700", "Sony", 1399, "Black"],
    ["Z6 III", "Nikon", 2499, "Black"],
    ["Z50 II", "Nikon", 999, "Black"],
    ["X-T5", "Fujifilm", 1699, "Silver"],
    ["X100VI", "Fujifilm", 1599, "Silver"],
    ["HERO13 Black", "GoPro", 399, "Black"],
  ],

  "Smart Home": [
    ["Echo Dot 5th Gen", "Amazon", 49, "Charcoal"],
    ["Echo Show 8", "Amazon", 149, "White"],
    ["Echo Studio", "Amazon", 199, "Black"],
    ["Nest Audio", "Google", 99, "Chalk"],
    ["Nest Hub 2nd Gen", "Google", 99, "Chalk"],
    ["HomePod mini", "Apple", 99, "White"],
    ["Smart LED Bulb 4-Pack", "Philips Hue", 79, "White"],
    ["Hue Bridge", "Philips Hue", 59, "White"],
    ["Indoor Security Camera", "TP-Link", 39, "White"],
    ["Video Doorbell", "Ring", 99, "Satin Nickel"],
  ],

  Wearables: [
    ["Apple Watch Series 10", "Apple", 399, "Jet Black"],
    ["Apple Watch Ultra 2", "Apple", 799, "Natural Titanium"],
    ["Apple Watch SE", "Apple", 249, "Midnight"],
    ["Galaxy Watch Ultra", "Samsung", 649, "Titanium Gray"],
    ["Galaxy Watch7", "Samsung", 299, "Green"],
    ["Galaxy Fit3", "Samsung", 69, "Silver"],
    ["Pixel Watch 3", "Google", 349, "Black"],
    ["Forerunner 265", "Garmin", 449, "Black"],
    ["Venu 3", "Garmin", 449, "Slate"],
    ["Charge 6", "Fitbit", 159, "Obsidian"],
  ],
};

const users = [
  { name: "Admin User", email: "admin@demo.com", role: "admin" },
  { name: "John Doe", email: "john@demo.com", role: "subscriber" },
  { name: "Jane Smith", email: "jane@demo.com", role: "subscriber" },
  { name: "Alex Johnson", email: "alex@demo.com", role: "subscriber" },
  { name: "Priya Sharma", email: "priya@demo.com", role: "subscriber" },
  { name: "Rahul Kumar", email: "rahul@demo.com", role: "subscriber" },
  { name: "Emily Davis", email: "emily@demo.com", role: "subscriber" },
  { name: "Michael Brown", email: "michael@demo.com", role: "subscriber" },
  { name: "Sara Wilson", email: "sara@demo.com", role: "subscriber" },
  { name: "David Miller", email: "david@demo.com", role: "subscriber" },
  { name: "Ananya Patel", email: "ananya@demo.com", role: "subscriber" },
  { name: "Chris Taylor", email: "chris@demo.com", role: "subscriber" },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    // WARNING: This clears all documents in these four collections.
    await Promise.all([
      Category.deleteMany({}),
      Sub.deleteMany({}),
      Product.deleteMany({}),
      User.deleteMany({}),
    ]);

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0];
    const customers = createdUsers.slice(1);

    console.log(`Created ${createdUsers.length} users.`);

    const categoryMap = {};
    const subMap = {};

    for (const data of categoryData) {
      const category = await Category.create({
        name: data.name,
        slug: slugify(data.name, { lower: true, strict: true }),
      });

      categoryMap[data.name] = category;

      for (const subName of data.subs) {
        const sub = await Sub.create({
          name: subName,
          slug: slugify(subName, { lower: true, strict: true }),
          parent: category._id,
        });

        subMap[subName] = sub;
      }
    }

    console.log("Created 10 categories and 20 subcategories.");

    const products = [];

    for (const data of categoryData) {
      const items = catalog[data.name];

      for (let i = 0; i < items.length; i++) {
        const [name, brand, price, color] = items[i];

        // Alternate between this category's two subcategories.
        const subName = data.subs[i % data.subs.length];

        const customer = customers[i % customers.length];
        const star = 3 + (i % 3); // 3, 4 or 5 stars

        products.push({
          title: name,
          slug: slugify(name, {
            lower: true,
            strict: true,
          }),
          description:
            `${name} by ${brand}. ` +
            `Explore this ${data.name.toLowerCase()} product, ` +
            `designed for everyday use with a ${color.toLowerCase()} finish. ` +
            `Suitable for personal, home, or professional use.`,
          price,
          category: categoryMap[data.name]._id,
          subs: [subMap[subName]._id],
          quantity: 10 + ((i * 7) % 41),
          sold: (i * 3) % 30,
          shipping: "Yes",
          color,
          brand,
          images: [data.image],
          ratings: [
            {
              star,
              postedBy: customer._id,
            },
            {
              star: Math.min(5, star + 1),
              postedBy: customers[(i + 1) % customers.length]._id,
            },
          ],
        });
      }
    }

    // Verify product count and unique slugs before insertion.
    const slugs = products.map((product) => product.slug);

    if (new Set(slugs).size !== slugs.length) {
      throw new Error("Duplicate product slugs detected.");
    }

    if (products.length < 50) {
      throw new Error("Expected at least 50 products.");
    }

    await Product.insertMany(products);

    console.log("--------------------------------");
    console.log("SEED COMPLETED SUCCESSFULLY");
    console.log(`Categories: ${categoryData.length}`);
    console.log(
      `Subcategories: ${Object.keys(subMap).length}`
    );
    console.log(`Users: ${createdUsers.length}`);
    console.log(`Products: ${products.length}`);
    console.log(`Admin email: ${adminUser.email}`);
    console.log("--------------------------------");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
}

seed();
