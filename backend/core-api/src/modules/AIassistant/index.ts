import express from "express";
import path from "path";
import { spawn } from "child_process";

import { mutationResolvers as trainingMutations } from "./graphql/resolvers/mutations";
import { queryResolvers as trainingQueries } from "./graphql/resolvers/queries";

import { generalMutations } from "./graphql/resolvers/generalMutations";
import { generalQueries } from "./graphql/resolvers/generalQueries";
import { generaltypes } from "./graphql/generalSchema";

import { mutationResolvers as systemPromptMutations } from "./graphql/resolvers/systemPromptMutations";
import { queryResolvers as systemPromptQueries } from "./graphql/resolvers/systemPromptQueries";

import { systemPrompttypes } from "./graphql/systemPromptSchema";
import { types } from "./graphql/schema";
import { healthCheck } from "./utils/ragService";
import generalRouter from "./general";
import { buildSystemPrompt } from "./systemprompt";

const RAG_SERVICE_PATH = path.join(__dirname, "rag-service");

export default {
  name: "aiassistant",
  graphql: {
    types: () => [types, generaltypes, systemPrompttypes],
    resolvers: {
      Mutation: {
        ...trainingMutations,
        ...generalMutations,
        ...systemPromptMutations, 
      },
      Query: {
        ...trainingQueries,
        ...generalQueries,
        ...systemPromptQueries, 
      },
    },
  },
  initApp: (app: express.Application) => {
    // Health check route
    app.get("/api/ai-assistant/health", async (req, res) => {
      try {
        const health = await healthCheck();
        res.json(health);
      } catch {
        res.status(500).json({ error: "Failed to connect to AI backend" });
      }
    });

    // Root info route
    app.get("/ai-assistant", async (req, res) => {
      res.json({
        message: "AI Assistant API is running",
        endpoints: {
          health: "/api/ai-assistant/health",
          graphql: "/graphql",
          general: "/api/ai-assistant/general",
          systemPrompt: "/api/ai-assistant/systemprompt",
        },
      });
    });

    // General settings REST route
    app.use("/api/ai-assistant/general", generalRouter);

    // System prompt REST route
    app.get("/api/ai-assistant/systemprompt", async (req, res) => {
      try {
        const orgId = String(req.query.orgId || "");
        const prompt = await buildSystemPrompt({ orgId });
        res.json({ prompt });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    });

    // Start RAG service in dev mode
    if (process.env.NODE_ENV !== "production") {
      startPythonService();
    }
  },
};

// Start local RAG Python service
function startPythonService() {
  const pythonProcess = spawn("python", ["--version"]);
  pythonProcess.on("error", () => {
    console.log("Python not available, RAG service will not start");
  });
  pythonProcess.on("exit", (code) => {
    if (code === 0) {
      const ragProcess = spawn(
        "python",
        [
          "-m",
          "uvicorn",
          "src.main:app",
          "--host",
          "0.0.0.0",
          "--port",
          "8000",
          "--reload",
        ],
        { cwd: RAG_SERVICE_PATH, stdio: "inherit" }
      );
      ragProcess.on("error", (err) => {
        console.error("Failed to start RAG service:", err);
      });
      console.log("RAG service started on port 8000");
    }
  });
}