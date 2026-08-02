import express from "express";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = 3000;

// MERN Stack - MongoDB Mongoose Model (Optional persistent store)
let isMongoConnected = false;

const DocumentSchema = new mongoose.Schema({
  docId: String,
  fileName: String,
  fileType: String,
  fileSize: Number,
  detectedLanguage: String,
  targetLanguage: String,
  summary: String,
  keyPoints: [String],
  originalText: String,
  translatedDocument: String,
  metadata: {
    docType: String,
    tone: String,
    wordCount: Number,
    pageCount: Number,
    formattingNotes: String
  },
  createdAt: { type: Date, default: Date.now }
});

const DocumentModel = mongoose.models.Document || mongoose.model("Document", DocumentSchema);

// Connect to MongoDB if MONGO_URI is provided
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      isMongoConnected = true;
      console.log("Connected to MongoDB database successfully.");
    })
    .catch((err) => {
      console.warn("MongoDB connection warning:", err.message);
    });
}

// Configure Multer for in-memory file uploads up to 25MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Helper to get Groq Client
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Groq({ apiKey });
}

// Helper to get Google GenAI SDK lazily
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// API Health Endpoint (Includes MERN status & AI Providers status)
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    stack: "MERN (MongoDB, Express, React, Node)",
    aiProviders: {
      groq: Boolean(process.env.GROQ_API_KEY),
      gemini: Boolean(process.env.GEMINI_API_KEY)
    },
    mongoConnected: isMongoConnected,
    timestamp: new Date().toISOString()
  });
});

// Dynamic Project ZIP Download Endpoint
app.get("/api/download-zip", (_req, res) => {
  try {
    const zipPath = path.join(process.cwd(), "project.zip");
    
    // Generate or update project.zip using python3 zipfile module
    const pythonScript = `import zipfile, os
zip_filename = 'project.zip'
with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in ('node_modules', 'dist', '.git', '.cache', '__pycache__')]
        for file in files:
            if file == zip_filename or file.endswith('.log'): continue
            filepath = os.path.join(root, file)
            z.write(filepath, os.path.relpath(filepath, '.'))
`;
    execSync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`, { cwd: process.cwd() });

    if (fs.existsSync(zipPath)) {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="linguify-mern-project.zip"');
      return res.sendFile(zipPath);
    } else {
      return res.status(500).json({ error: "Failed to locate generated project.zip" });
    }
  } catch (err: any) {
    console.error("Error generating zip file:", err);
    return res.status(500).json({ error: "Failed to generate project zip: " + err.message });
  }
});

// Translation & Summarization API Endpoint
app.post("/api/translate-document", upload.single("file"), async (req, res) => {
  try {
    const targetLanguage = (req.body.targetLanguage || "English").trim();
    const customInstructions = (req.body.customInstructions || "").trim();
    const rawTextInput = (req.body.textInput || "").trim();

    let fileContentText = "";
    let fileName = "Document";
    let fileType = "text/plain";
    let fileSize = 0;
    let fileBase64Data: { mimeType: string; data: string } | null = null;

    if (req.file) {
      fileName = req.file.originalname;
      fileType = req.file.mimetype || "application/octet-stream";
      fileSize = req.file.size;

      if (
        fileType.includes("pdf") ||
        fileType.includes("image/") ||
        fileType.includes("png") ||
        fileType.includes("jpg") ||
        fileType.includes("jpeg") ||
        fileType.includes("webp")
      ) {
        fileBase64Data = {
          mimeType: fileType.includes("pdf") ? "application/pdf" : fileType,
          data: req.file.buffer.toString("base64")
        };
        fileContentText = `[Uploaded Binary File: ${fileName} (${fileType})]`;
      } else {
        fileContentText = req.file.buffer.toString("utf-8");
      }
    } else if (rawTextInput) {
      fileName = "Pasted_Text_Document.txt";
      fileSize = Buffer.byteLength(rawTextInput, "utf-8");
      fileContentText = rawTextInput;
    } else {
      return res.status(400).json({ error: "No file or text content provided for translation." });
    }

    const systemPrompt = `You are an elite document translation assistant and structural document analyzer.
Your task is to analyze the provided document, extract its contents, translate it accurately into "${targetLanguage}", summarize its key message, and extract key action points.

CRITICAL FORMATTING INSTRUCTIONS:
1. PRESERVE ORIGINAL DOCUMENT FORMATTING STRICTLY:
   - Use identical structural elements: Headers (#, ##, ###), bullet lists (-), numbered lists (1.), tables (| header | header |), bold/italic text (**text**), blockquotes (>), code blocks (\`\`\`), and horizontal rules.
   - Maintain the line-by-line visual organization, columns, and section hierarchy of the original document.
   - Do NOT collapse paragraphs or remove bullet points.

2. ACCURATE TRANSLATION:
   - Translate all text accurately into ${targetLanguage} while keeping names, brand titles, technical code, formulas, or standard un-translated acronyms intact.
   - Natural, idiomatically precise translation that sounds native.

3. SUMMARY & KEY POINTS:
   - Provide a high-level executive summary (2-4 sentences).
   - Extract 3-6 bulleted key points highlighting crucial facts, numbers, dates, terms, or findings.

${customInstructions ? `USER CUSTOM INSTRUCTIONS FOR THIS TRANSLATION:\n"${customInstructions}"\n` : ''}`;

    const jsonSchemaInstructions = `
CRITICAL: You MUST reply ONLY with a valid JSON object strictly conforming to this exact JSON schema:
{
  "detectedLanguage": "The primary detected language of the original document (e.g. Japanese, French, Spanish)",
  "docType": "Category of the document (e.g. Legal Contract, Technical Manual, Business Report)",
  "tone": "Tone of the document (e.g. Formal, Technical, Casual, Legal)",
  "summary": "Executive summary of the document (2-4 sentences)",
  "keyPoints": ["3 to 6 essential takeaways or action points"],
  "originalText": "Full transcribed text of the original document formatted neatly in Markdown",
  "translatedDocument": "Complete translated document in full target language (${targetLanguage}) strictly preserving original formatting (headers, lists, tables, bold styling) in clean Markdown",
  "formattingNotes": "Brief note explaining how layout and structure were preserved"
}`;

    let responseText = "";
    const groq = getGroqClient();

    if (groq) {
      // Use Groq AI (LLaMA 3.3 70B Versatile / Vision)
      console.log("Processing translation using Groq AI...");
      
      const groqMessages: any[] = [
        {
          role: "system",
          content: `${systemPrompt}\n\n${jsonSchemaInstructions}`
        }
      ];

      if (fileBase64Data && fileType.includes("image")) {
        // Groq LLaMA 3.2 Vision for images
        groqMessages.push({
          role: "user",
          content: [
            { type: "text", text: `Please process this image document and translate into ${targetLanguage}:` },
            { type: "image_url", image_url: { url: `data:${fileBase64Data.mimeType};base64,${fileBase64Data.data}` } }
          ]
        });
      } else {
        groqMessages.push({
          role: "user",
          content: `DOCUMENT CONTENT TO TRANSLATE (${fileName}):\n\n${fileContentText}`
        });
      }

      const completion = await groq.chat.completions.create({
        messages: groqMessages,
        model: fileBase64Data && fileType.includes("image") ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      responseText = completion.choices[0]?.message?.content || "";
    } else {
      // Fallback to Gemini AI
      const genAI = getGenAI();
      if (!genAI) {
        throw new Error("No AI API key found. Please set GROQ_API_KEY or GEMINI_API_KEY in environment variables.");
      }
      console.log("Processing translation using Gemini AI...");

      let contents: any[] = [];
      if (fileBase64Data) {
        contents.push({
          inlineData: fileBase64Data
        });
      } else {
        contents.push({
          text: `DOCUMENT SOURCE FILE CONTENT (${fileName}):\n\n${fileContentText}`
        });
      }
      contents.push({ text: systemPrompt });

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detectedLanguage: { type: Type.STRING },
              docType: { type: Type.STRING },
              tone: { type: Type.STRING },
              summary: { type: Type.STRING },
              keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              originalText: { type: Type.STRING },
              translatedDocument: { type: Type.STRING },
              formattingNotes: { type: Type.STRING }
            },
            required: ["detectedLanguage", "summary", "keyPoints", "originalText", "translatedDocument"]
          }
        }
      });
      responseText = response.text || "";
    }

    if (!responseText) {
      throw new Error("Empty response received from AI model.");
    }

    const resultJson = JSON.parse(responseText);

    const wordCount = (resultJson.translatedDocument || "").split(/\s+/).filter(Boolean).length;

    const resultPayload = {
      id: "trans_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      fileName,
      fileType,
      fileSize,
      detectedLanguage: resultJson.detectedLanguage || "Unknown",
      targetLanguage,
      summary: resultJson.summary,
      keyPoints: resultJson.keyPoints || [],
      originalText: resultJson.originalText || "Original text not extracted.",
      translatedDocument: resultJson.translatedDocument,
      metadata: {
        docType: resultJson.docType || "General Document",
        tone: resultJson.tone || "Neutral",
        wordCount,
        pageCount: Math.ceil(wordCount / 250) || 1,
        formattingNotes: resultJson.formattingNotes || "Layout and structural markdown preserved."
      },
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected) {
      try {
        await DocumentModel.create({
          docId: resultPayload.id,
          ...resultPayload
        });
      } catch (dbErr) {
        console.warn("Failed to persist document to MongoDB:", dbErr);
      }
    }

    return res.json({ success: true, data: resultPayload });
  } catch (error: any) {
    console.error("Translation API error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An unexpected error occurred during translation."
    });
  }
});

// Interactive AI Document Chat Endpoint
app.post("/api/chat-document", async (req, res) => {
  try {
    const { documentContext, question, history } = req.body;

    if (!question || !documentContext) {
      return res.status(400).json({ error: "Missing document content or question." });
    }

    const systemInstruction = `You are an expert document assistant. You have full context of a document and its translation. Answer the user's question clearly, concisely, and accurately based on the document content provided. If the information is not in the document, state that clearly.`;

    const chatHistoryText = (history || [])
      .map((msg: { sender: string; text: string }) => `${msg.sender.toUpperCase()}: ${msg.text}`)
      .join("\n");

    const prompt = `DOCUMENT CONTEXT:
${documentContext}

PREVIOUS CHAT HISTORY:
${chatHistoryText}

USER QUESTION:
${question}`;

    let answerText = "";
    const groq = getGroqClient();

    if (groq) {
      console.log("Processing chat response using Groq AI...");
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3
      });
      answerText = completion.choices[0]?.message?.content || "";
    } else {
      const genAI = getGenAI();
      if (!genAI) {
        throw new Error("No AI API key found. Please set GROQ_API_KEY or GEMINI_API_KEY in environment variables.");
      }
      console.log("Processing chat response using Gemini AI...");
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ text: prompt }],
        config: {
          systemInstruction
        }
      });
      answerText = response.text || "";
    }

    return res.json({
      success: true,
      answer: answerText || "I could not generate an answer based on this document."
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to answer question."
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
}

startServer();
