import { useState, useRef } from "react";
import axios from "axios";
import "./DataTraining.css";

interface Dataset {
  name: string;
  active: boolean;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [orgId, setOrgId] = useState<string>("default_org");
  const answerRef = useRef<HTMLDivElement | null>(null);

  const [datasets, setDatasets] = useState<Dataset[]>([
    { name: "erkhet knowledge", active: true },
    { name: "HR team knowledge", active: false },
    { name: "Product development team", active: true },
    { name: "Gorillaz", active: true },
  ]);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Idle");
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const pollStatus = (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:8000/status/${taskId}`);
        setProgress(res.data.progress);
        setStage(res.data.stage);
        if (res.data.done) {
          clearInterval(interval);
          setProgress(100);
          setStage("Completed");
          setTimeout(() => {
            setIsTraining(false);
            setStage("Idle");
            setProgress(0);
          }, 3000)
        }
      } catch (err) {
        console.error("Status check failed:", err);
        clearInterval(interval);
      }
    }, 2000);
  };

  const handleUpload = async () => {
    if (!file) return alert("Choose a file first!");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("org_id", "default_org");

    try {
      setIsTraining(true);
      setUploadProgress(0);

      const res = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          }
        },
      });

      if (res.data.org_id) {
        setOrgId(res.data.org_id);
      }

      alert(res.data.message);
      setUploadMessage(res.data.message);
      pollStatus(res.data.task_id);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed, check backend logs.");
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
          body: "{}", // required for POST in FastAPI
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
        <p className="subtitle">Train your AI assistant on important data</p>

        <div className="upload-card">
          <h3>Upload new file</h3>
          <div className="upload-box">
            <input
              type="file"
              accept=".docx,.xlsx,.xls,.pdf"
              id="fileInput"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
            <label htmlFor="fileInput">
              {file ? file.name : "Drag & drop or click to upload"}
            </label>
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
                <span>{stage}</span>
                <span>{progress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${
                    progress === 0 && stage !== "Idle"
                      ? "progress-indeterminate"
                      : ""
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="dataset-list">
          {datasets.map((ds, i) => (
            <div key={i} className="dataset-item">
              <span>{ds.name}</span>
              <span
                className={`status ${ds.active ? "active" : "inactive"}`}
              >
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







