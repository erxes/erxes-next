import { useState, useEffect } from "react";
import "./General.css";

function General() {
const [assistantName, setAssistantName] = useState("Sparkles AI");
const [conversationStarter, setConversationStarter] = useState(
  "How can I help you today?"
);
const [description, setDescription] = useState(
  "Get quick answers and insights about your customers and sales pipeline."
);
const [promptSuggestions, setPromptSuggestions] = useState<string[]>([
  "Summarize the last 10 conversations from Team Inbox",
  "From contacts, give me details of a person who works at xyz...",
]);


useEffect(() => {
  fetch("http://localhost:8000/api/ai-assistant/general/my-org-id")
    .then((res) => res.json())
    .then((data) => {
      const s = data.settings;
      setAssistantName(s.assistantName);
      setConversationStarter(s.conversationStarter);
      setDescription(s.description);
      setPromptSuggestions(s.promptSuggestions || []);
    })
    .catch((err) => console.error("Failed to load settings:", err));
}, []);


const handleAddPrompt = () => {
  if (promptSuggestions.length >= 4) return;
  setPromptSuggestions([...promptSuggestions, ""]);
};




const handleUpdatePrompt = (index: number, value: string) => {
  const updated = [...promptSuggestions];
  updated[index] = value;
  setPromptSuggestions(updated);
};




const handleRemovePrompt = (index: number) => {
  setPromptSuggestions(promptSuggestions.filter((_, i) => i !== index));
};




const handleSave = async () => {
  const payload = {
    assistantName,
    conversationStarter,
    description,
    promptSuggestions,
  };

  try {
    const res = await fetch(
      "http://localhost:8000/api/ai-assistant/general/my-org-id",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    alert(data.message || "✅ Settings saved!");
  } catch (err) {
    console.error(err);
    alert("❌ Failed to save settings");
  }
};






return (
  <div className="general-container">
    <h2>General</h2>
    <p className="subtitle">Set up your AI Assistant</p>




    {/* Avatar + Name */}
    <div className="field-row">
      <div className="avatar-section">
        <img
          src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
          alt="Assistant Avatar"
          className="avatar"
        />
        <button className="btn secondary">Replace avatar</button>
      </div>
      <div className="input-section">
        <label>Assistant name</label>
        <input
          type="text"
          value={assistantName}
          onChange={(e) => setAssistantName(e.target.value)}
        />
      </div>
    </div>


    <div className="field">
      <label>Conversation starter</label>
      <input
        type="text"
        value={conversationStarter}
        onChange={(e) => setConversationStarter(e.target.value)}
        placeholder="How can I help you today?"
      />
    </div>


    <div className="field">
      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Get quick answers and insights..."
      />
    </div>




    <div className="field">
      <label>Prompt suggestions (max 4)</label>
      <div className="prompt-list">
        {promptSuggestions.map((prompt, i) => (
          <div className="prompt-item" key={i}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => handleUpdatePrompt(i, e.target.value)}
              placeholder="Type a suggestion..."
            />
            <button
              className="icon-btn"
              onClick={() => handleRemovePrompt(i)}
            >
              ✕
            </button>
          </div>
        ))}
        {promptSuggestions.length < 4 && (
          <button className="btn small" onClick={handleAddPrompt}>
            + Add suggestion
          </button>
        )}
      </div>
    </div>




    <button className="btn primary save-btn" onClick={handleSave}>
      Save
    </button>
  </div>
);
}




export default General;


