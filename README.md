# DBStore - Next-Gen MERN E-Commerce with AI Shopping Agent

A modern, high-performance **MERN Stack E-Commerce Platform** featuring an **AI Shopping Agent** powered by **LangChain**, **LangGraph**, and **Ollama (Llama 3.2:1b)**, styled with an attractive **DB Theme** and built for seamless mobile responsiveness.

---

## 🌟 Key Highlights & Modern Upgrades

1. **AI Shopping Agent Module**:
   - Built with **LangChain**, **LangGraph `createReactAgent`**, and **Ollama `llama3.2:1b`**.
   - Connected live to MongoDB using **`search_products`** and **`search_by_price_range`** dynamic structured tools.
   - **Interactive Product Cards in Chat**: Users can inspect thumbnails, titles, prices, and click "View" or "+ Cart" directly inside chat bubbles.
   - Accessible via:
     - **Global Floating AI Chat Widget** available on every screen.
     - **Dedicated Full-Page AI Assistant Module** (`/ai-assistant`).

2. **DB Design System & Mobile-Friendly UI**:
   - Deep rich DB color palette (`#DC143C` gradient, `#8B0000`, `#FFF0F3` soft accents).
   - Touch-optimized responsive navigation with **Mobile Bottom Bar** (Home, Shop, AI Chat, Cart, Profile).
   - Collapsible filter sidebar on Shop page for seamless smartphone browsing.
   - Fluid typography, glassmorphism headers, elevation hover cards, and interactive order confetti.

3. **Modernized Module Versions**:
   - **Backend**: Express 4.21.2, Mongoose 8.10.1, @langchain/core 1.2+, @langchain/ollama 1.3+, @langchain/langgraph 1.5+, Zod 3.24+/4.x, Dotenv 16.4.7.
   - **Frontend**: React 18.3.1, React Router 6.28.0, Redux 5.0.1, @redux-devtools/extension 3.3.0, React-Toastify 10.0.6, Canvas-Confetti, Lodash.

4. **Missing Features Completed**:
   - **Related Products**: Fully implemented on single product pages (`getRelated(productId)`).
   - **Instant Demo Authentication**: 1-Click Customer and Admin logins without requiring immediate Firebase configuration.
   - **Safe Image Handling**: Resilient URL parser supporting both external CDN URLs (Unsplash) and local uploads.
   - **Database Seeder**: Pre-populated with 12 flagship electronics products, categories, subcategories, and reviews.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18, v20, or v24 recommended)
- **MongoDB** running locally on port `27017` (or MongoDB Atlas connection string)
- **Ollama** running locally on `http://localhost:11434` with `llama3.2:1b` model:
  ```bash
  ollama run llama3.2:1b
  ```

---

### 1. Backend Setup

```bash
cd server
npm install
```

> **Note for Windows PowerShell**: If script execution is disabled on your system, use `npm.cmd install` and `npm.cmd start`.

**Seed Sample Products & Categories**:
```bash
node seed.js
```

**Start Backend Server** (runs on port 8000):
```bash
npm start
```
Verify AI Agent Health:
```bash
curl http://localhost:8000/api/ai/health
```

---

### 2. Frontend Setup

```bash
cd client
npm install
npm start
```

Frontend will automatically start on `http://localhost:3000`.

---

## 🤖 AI Agent API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/chat` | Send customer message to LangGraph agent with live database tools |
| `GET` | `/api/ai/suggestions` | Fetch quick starter prompt chips |
| `GET` | `/api/ai/health` | Check status of Ollama LLM and MongoDB connection |

### Sample Chat Request:
```bash
curl -X POST http://localhost:8000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What Apple laptops do you have in stock?"}'
```

### Sample Response:
```json
{
  "success": true,
  "reply": "We have two MacBook models in stock:\n1. MacBook Pro 16 M3 Max ($2499)\n2. MacBook Air 15 M3 ($1299)...",
  "products": [
    {
      "title": "MacBook Pro 16 M3 Max",
      "price": 2499,
      "slug": "macbook-pro-16-m3-max",
      "brand": "Apple"
    }
  ],
  "timestamp": "2026-10-18T07:17:34.938Z"
}
```

---

## 📱 Mobile UI Features
- **Adaptive Product Grid**: Shifts smoothly from 4 columns on desktop to 2 columns on mobile.
- **Mobile Filter Offcanvas**: Quick toggle button hides/reveals filter sidebar on small screens.
- **Floating AI Launcher**: Fixed circular crimson button with live pulsating glow.
- **Mobile Bottom Navigation Bar**: Easy single-thumb navigation across Home, Shop, AI Chat, Cart, and Account.

---

## 🔒 Authentication Modes
1. **1-Click Quick Demo Login**:
   - **Customer Mode**: Logs in as demo customer, enables order history and checkout.
   - **Admin Mode**: Logs in as demo admin, unlocks Admin Dashboard, category management, and coupon creation.
2. **Firebase Auth**:
   - Configure credentials in `server/src/v1/config/fbServiceAccountKey.json` and `client/src/firebase.js` for production Firebase verification.
