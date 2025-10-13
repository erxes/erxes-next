import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SYSTEM_PROMPT } from "./graphql/systemPromptQueries";
import { UPDATE_SYSTEM_PROMPT } from "./graphql/systemPromptMutations";
import "./SystemPrompt.css";

const SystemPrompt = () => {
  const { data, loading } = useQuery(GET_SYSTEM_PROMPT);
  const [updateSystemPrompt] = useMutation(UPDATE_SYSTEM_PROMPT);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    if (data?.getSystemPrompt?.prompt) {
      setPrompt(data.getSystemPrompt.prompt);
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateSystemPrompt({
        variables: { prompt },
        refetchQueries: [{ query: GET_SYSTEM_PROMPT }]
      });
      alert("✅ System prompt saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Could not save system prompt");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="systemprompt-container">
      <h2 className="systemprompt-title">System Prompt</h2>
      <p className="systemprompt-description">
        Write the system prompt for your AI assistant
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={8}
        className="systemprompt-textarea"
      />

      <div className="systemprompt-actions">
        <button onClick={handleSave} className="systemprompt-save">
          Save
        </button>
      </div>
    </div>
  );
};

export default SystemPrompt;