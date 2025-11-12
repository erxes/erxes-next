import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SYSTEM_PROMPT } from "~/modules/aiassistant/graphql/systemPromptQueries";
import { UPDATE_SYSTEM_PROMPT } from "~/modules/aiassistant/graphql/systemPromptMutations";
import "./systemPrompt.css";

const SystemPrompt = () => {
  const { data, loading, error } = useQuery(GET_SYSTEM_PROMPT);
  const [updateSystemPrompt, { loading: saving }] = useMutation(UPDATE_SYSTEM_PROMPT);
  const [prompt, setPrompt] = useState("");

  //  Load existing prompt into textarea
  useEffect(() => {
    if (data?.getSystemPrompt?.prompt) {
      setPrompt(data.getSystemPrompt.prompt);
    }
  }, [data]);

  // Save only when user clicks "Save"
  const handleSave = async () => {
    if (!prompt.trim()) {
      alert("⚠️ Prompt cannot be empty");
      return;
    }
    try {
      await updateSystemPrompt({
        variables: { prompt },
        refetchQueries: [{ query: GET_SYSTEM_PROMPT }],
      });
      alert("✅ System prompt saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save system prompt!");
    }
  };


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
        <button onClick={handleSave} className="systemprompt-save" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default SystemPrompt;

