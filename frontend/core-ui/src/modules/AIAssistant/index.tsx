import { useState } from "react";
import DataTraining from "./DataTraining";
import General from "./General";
import SystemPrompt from "./SystemPrompt";


const AIAssistant = () => {
 const [activeTab, setActiveTab] = useState<"general" | "training" | "system">(
   "general"
 );


 return (
   <div style={{ display: "flex", minHeight: "100vh" }}>
     <aside
       style={{
         width: "220px",
         background: "#fff",
         borderRight: "1px solid #eee",
         padding: "20px",
       }}
     >
       <h3 style={{ marginBottom: "15px" }}>Settings</h3>
       <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
         <li
           style={{
             padding: "10px 0",
             cursor: "pointer",
             fontWeight: activeTab === "general" ? "bold" : "normal",
             color: activeTab === "general" ? "#5a4dff" : "#333",
           }}
           onClick={() => setActiveTab("general")}
         >
           General
         </li>
         <li
           style={{
             padding: "10px 0",
             cursor: "pointer",
             fontWeight: activeTab === "training" ? "bold" : "normal",
             color: activeTab === "training" ? "#5a4dff" : "#333",
           }}
           onClick={() => setActiveTab("training")}
         >
           Data training
         </li>
         <li
           style={{
             padding: "10px 0",
             cursor: "pointer",
             fontWeight: activeTab === "system" ? "bold" : "normal",
             color: activeTab === "system" ? "#5a4dff" : "#333",
           }}
           onClick={() => setActiveTab("system")}
         >
           System prompt
         </li>
       </ul>
     </aside>


     <main style={{ flex: 1, padding: "30px" }}>
       {activeTab === "general" && <General />}
       {activeTab === "training" && <DataTraining />}
       {activeTab === "system" && <SystemPrompt />}
     </main>
   </div>
 );
};


export default AIAssistant;

