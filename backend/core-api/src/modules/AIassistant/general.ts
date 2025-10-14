import { Router, Request, Response } from "express";
const router: Router = Router();

// in-memory store
let generalSettings = {
  assistantName: "Sparkles AI",
  conversationStarter: "How can I help you today?",
  description:
    "Get quick answers and insights about your customers and sales pipeline.",
  promptSuggestions: [
    "Summarize the last 10 conversations from Team Inbox",
    "List all open leads assigned to me",
    "Answer customer FAQs quickly",
  ],
};

// ✅ GET route (fixed)
router.get("/ai-assistant/general/:orgId", (req: Request, res: Response) => {
  res.json(generalSettings);
});

// ✅ POST route (already in your file, just make sure it updates generalSettings)
router.post("/ai-assistant/general/:orgId", (req: Request, res: Response) => {
  const { assistantName, conversationStarter, description, promptSuggestions } =
    req.body;

  generalSettings = {
    assistantName,
    conversationStarter,
    description,
    promptSuggestions,
  };

  res.json({ success: true, settings: generalSettings });
});

export default router;
