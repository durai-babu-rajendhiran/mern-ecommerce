const path = require("path");

let agentModule = null;

async function getAgent() {
  if (!agentModule) {
    agentModule = await import("../agent/agent.mjs");
  }
  return agentModule;
}

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const { runAgent, directSearch } = await getAgent();

    // Run agent in parallel with product lookup for rich preview cards
    const [reply, products] = await Promise.all([
      runAgent(message),
      directSearch(message),
    ]);

    return res.json({
      success: true,
      reply,
      products,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("AI Agent Controller error:", err);
    return res.status(500).json({
      success: false,
      error: "AI Agent encountered an error processing your request.",
      details: err.message,
    });
  }
};

exports.getSuggestions = (req, res) => {
  const suggestions = [
    { label: "MacBook & Apple Laptops", query: "Show me all Apple MacBook laptops and prices" },
    { label: "Laptops under $1500", query: "What laptops do you have under $1500?" },
    { label: "Top Flagship Phones", query: "Show me Samsung and iPhone flagship smartphones" },
    { label: "Gaming Powerhouses", query: "Do you have any ASUS or Lenovo gaming laptops?" },
    { label: "Premium Audio", query: "What headphones or audio gear do you have?" },
  ];
  return res.json({ success: true, suggestions });
};

exports.health = async (req, res) => {
  try {
    const { dbConnect } = await getAgent();
    await dbConnect();
    return res.json({
      success: true,
      status: "AI Agent service is operational",
      model: "llama3.2:1b",
      engine: "LangChain + Ollama + LangGraph",
      database: "MongoDB Connected",
    });
  } catch (err) {
    return res.status(503).json({
      success: false,
      status: "Degraded",
      error: err.message,
    });
  }
};
