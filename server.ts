import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Support Chat with Gemini API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, products, orders, user } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Fallback friendly simulation responses if Gemini Key is not set or is placeholder
        const textLower = message.toLowerCase();
        let fallbackReply = "Hello! I am your My Store AI assistant. How can I help you today?";
        
        if (textLower.includes("order")) {
          if (orders && orders.length > 0) {
            const activeOrder = orders[orders.length - 1];
            fallbackReply = `I found your most recent order **${activeOrder.orderNumber}** containing ${activeOrder.items.length} items (Total: $${activeOrder.total}). Its current status is **${activeOrder.status}**, and it is scheduled for delivery on **${activeOrder.deliveryDate}** during the **${activeOrder.deliveryTimeSlot}** window. Let me know if you'd like to check another order!`;
          } else {
            fallbackReply = "You don't have any active orders right now. Would you like help adding some fresh organic items to your cart?";
          }
        } else if (textLower.includes("apple") || textLower.includes("fruit")) {
          fallbackReply = "We have wonderful **Organic Red Apples** currently on sale for just **$3.99/kg** (discounted from $4.99!) and fresh ripe **Cavendish Bananas** for **$1.49/bunch**. Would you like me to guide you to the Fruits category?";
        } else if (textLower.includes("milk") || textLower.includes("dairy")) {
          fallbackReply = "Our dairy section features **Organic Whole Milk 3.5%** ($2.99 per gallon) and premium **Large Free Range Brown Eggs** ($3.89 for 12 pcs). Excellent choices for a healthy breakfast!";
        } else if (textLower.includes("discount") || textLower.includes("coupon") || textLower.includes("promo")) {
          fallbackReply = "Yes! You can use coupon code **FRESH20** at checkout to save **20%** on orders above $20, or **WELCOME5** for a flat **$5 off** orders over $15. Let me know if you need help applying it!";
        } else if (textLower.includes("hello") || textLower.includes("hi") || textLower.includes("hey")) {
          fallbackReply = `Hello ${user ? user.name : 'there'}! Welcome to **My Store** customer support. How can I assist you with your grocery shopping, order tracking, address setup, or coupons today?`;
        } else {
          fallbackReply = `Thank you for your message! Our AI grocery assistant is here to help. I see we have some amazing products in stock today, like Extra Virgin Olive Oil, Fresh Broccoli, and Artisanal Cookies. Let me know if you would like me to help find any specific items or look up your order details!`;
        }
        
        return res.json({ text: fallbackReply });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Build rich context prompt with current products and orders
      const productsContext = products && Array.isArray(products) 
        ? products.map((p: any) => `- [ID: ${p.id}] ${p.name} (${p.category}): $${p.price} per ${p.unit}. Stock: ${p.stock}. ${p.discountPrice ? `ON SALE for $${p.discountPrice}!` : ''}`).join('\n')
        : 'No products loaded.';

      const ordersContext = orders && Array.isArray(orders)
        ? orders.map((o: any) => `- Order ${o.orderNumber}: Total $${o.total}. Status: ${o.status}. Payment: ${o.paymentMethod} (${o.paymentStatus}). Delivery: ${o.deliveryDate} at ${o.deliveryTimeSlot}. Items: ${o.items.map((i: any) => `${i.quantity}x ${i.productName}`).join(', ')}`).join('\n')
        : 'No orders placed yet.';

      const userContext = user ? `${user.name} (${user.email}, Phone: ${user.phone})` : 'Anonymous Guest';

      const systemInstruction = `You are the friendly, professional, and knowledgeable AI Customer Support Assistant for "My Store", a premium online grocery mobile application.
Your goal is to assist customers with their inquiries, product recommendations, and order tracking.

Current Customer Info: ${userContext}

Current Store Inventory (Products):
${productsContext}

Customer's Active Orders:
${ordersContext}

Instructions:
1. Be polite, friendly, helpful, and concise. Avoid unnecessarily long essays.
2. Help customers find products. If they ask for recommendations or specific items, suggest actual items from the inventory listed above. Mention if they are on sale and specify their prices!
3. If they ask about their order status (e.g., "Where is my order?"), reference the orders listed in the context above. Check the Order Number and give them a highly specific update based on its status ("Pending", "Packed", "Shipped", "Delivered", "Cancelled") and delivery date/time slot.
4. If they want to cancel an order, inform them that they can cancel any "Pending" or "Packed" orders directly from their "My Orders" screen in the app with a single click, or do it for them in your reply (and ask them to confirm).
5. Do not hallucinate products, categories, or order numbers that are not in the provided lists.
6. Address the customer by name (${user ? user.name : 'there'}).
7. Use Markdown (bold, lists, etc.) to make the text clean and highly readable.`;

      // Structure chat messages for Gemini SDK
      const contents = [];
      
      // If history is provided, append past turns (limit to last 10 to conserve tokens)
      if (history && Array.isArray(history)) {
        const lastTurns = history.slice(-10);
        for (const h of lastTurns) {
          contents.push({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          });
        }
      }
      
      // Append latest message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "I'm sorry, I couldn't process your request. Is there anything else I can assist with?";
      res.json({ text: replyText });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({ error: "Failed to communicate with AI support assistant.", details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
