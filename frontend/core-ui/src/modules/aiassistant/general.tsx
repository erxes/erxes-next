import { useState } from "react";
import "./general.css";


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


 const handleSave = () => {
   console.log("Saving config:", {
     assistantName,
     conversationStarter,
     description,
     promptSuggestions,
   });
   alert("✅ Settings saved!");
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


     {/* Conversation Starter */}
     <div className="field">
       <label>Conversation starter</label>
       <input
         type="text"
         value={conversationStarter}
         onChange={(e) => setConversationStarter(e.target.value)}
         placeholder="How can I help you today?"
       />
     </div>


     {/* Description */}
     <div className="field">
       <label>Description</label>
       <textarea
         value={description}
         onChange={(e) => setDescription(e.target.value)}
         placeholder="Get quick answers and insights..."
       />
     </div>


     {/* Prompt Suggestions */}
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
