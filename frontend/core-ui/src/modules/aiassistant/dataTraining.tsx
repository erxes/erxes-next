import { useState, useRef } from "react";
import axios from "axios";
import "./datatraining.css";

interface Dataset {
  name: string;
  active: boolean;
}

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [orgId ] = useState<string>("default_org");
  const answerRef = useRef<HTMLDivElement | null>(null);

  const [datasets] = useState<Dataset[]>([
    { name: "erkhet knowledge", active: true },
    { name: "HR team knowledge", active: false },
    { name: "Product development team", active: true },
    { name: "Gorillaz", active: true },
  ]);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);


  const handleUpload = async () => {
  if (files.length === 0) {
    alert("Please select at least one file.");
    return;
  }

  setIsTraining(true);
  setUploadMessage(null);
  setUploadProgress(0);

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("org_id", orgId);

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percent);
          }
        },
      }
    );

    setUploadMessage(response.data.message || "Training completed successfully!");
  } catch (error: any) {
    console.error("❌ Upload failed:", error);
    setUploadMessage(
      error.response?.data?.detail || "❌ Failed to upload or train data."
    );
  } finally {
    setIsTraining(false);
    setUploadProgress(0);
  }
  };



  const handleAsk = async () => {
    if (!question.trim()) return alert("Type a question first!");
    setAnswer("Loading...");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/ask?question=${encodeURIComponent(
          question
        )}&org_id=${orgId}&top_k=3`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}", // FastAPI expects a body for POST
        }
      );

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }

      const data = await res.json();
      setAnswer(data.answer || "No answer returned.");
    } catch (err) {
      console.error("❌ Failed to get answer:", err);
      setAnswer("Error: could not fetch answer.");
    }
  };

  return (
    <div className="app">
      <main className="main">
        <h1>Data training</h1>
        <p className="subtitle">Train your AI assistant on up to 5 files</p>

        <div className="upload-card">
          <h3>Upload new files</h3>

          <div className="upload-box">
            <input
              type="file"
              accept=".docx,.xlsx,.xls"
              id="fileInput"
              multiple
              onChange={(e) =>
                setFiles(e.target.files ? Array.from(e.target.files) : [])
              }
            />
            <label htmlFor="fileInput">
              {files.length > 0
                ? `${files.length} file(s) selected`
                : "Drag & drop or click to upload up to 5 files"}
            </label>
            {files.length > 0 && (
              <ul className="file-list">
                {files.map((f, i) => (
                  <li key={i}>{f.name}</li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleUpload}
            className="btn primary"
            disabled={isTraining}
          >
            {isTraining ? "Training..." : "Train data"}
          </button>

          {isTraining && (
            <div className="progress-container">
              <div className="progress-header">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {uploadMessage && (
            <p className="upload-message">{uploadMessage}</p>
          )}
        </div>

        <div className="dataset-list">
          {datasets.map((ds, i) => (
            <div key={i} className="dataset-item">
              <span>{ds.name}</span>
              <span className={`status ${ds.active ? "active" : "inactive"}`}>
                {ds.active ? "ACTIVE" : "INACTIVE"}
              </span>
              <button className="icon-btn">✏️</button>
              <button className="icon-btn delete">🗑️</button>
            </div>
          ))}
        </div>

        <div className="ask-card">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question"
          />
          <button onClick={handleAsk} className="btn">
            Ask
          </button>
          {answer && (
            <div className="answer-box" ref={answerRef}>
              {answer}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
