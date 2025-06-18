// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });

import express from "express";
import path from "path";
import fs from "fs";
import { OpenAI } from "openai";
import axios from "axios";
import * as cheerio from "cheerio";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.static(path.join(process.cwd(), "public"))); // Static files should be served by Hosting
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  // environment: process.env.PINECONE_ENVIRONMENT,
  // projectId: process.env.PINECONE_PROJECT_ID,
});

const indexName = process.env.PINECONE_INDEX_NAME; // Use env var for index name

// Initialize Pinecone index
const index = pinecone.index(indexName);

const urlRegex = /(https?:\/\/[^\s]+)/g;

const extractResumeText = async () => {
  const resumePath = path.join(__dirname, "public", "assets", "resume.pdf");

  if (!fs.existsSync(resumePath)) {
    console.error("Error: Resume file not found at", resumePath);
    return "Resume file not found.";
  }

  try {
    const dataBuffer = fs.readFileSync(resumePath);
    const dataUint8Array = new Uint8Array(dataBuffer); // Convert Buffer to Uint8Array
    const loadingTask = pdfjsLib.getDocument(dataUint8Array);
    const pdfDocument = await loadingTask.promise;
    let textContent = "";

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContentObj = await page.getTextContent();
      textContent += textContentObj.items.map((item) => item.str).join(" ");
    }

    console.log("Extracted Resume Text:\n", textContent);
    return textContent;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return "Failed to parse resume.";
  }
};

const storeResumeInVectorDB = async () => {
  const resumeText = await extractResumeText();
  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: resumeText,
    });
    await index.upsert([{ id: "resume", values: embedding.data[0].embedding, metadata: { text: resumeText } }]);
    console.log("Resume stored in vector database.");
  } catch (error) {
    console.error("Error storing resume in vector store:", error);
  }
};

await storeResumeInVectorDB();

const extractWebpageContent = async (url) => {
  try {
    const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const $ = cheerio.load(data);
    const pageText = $("body").text().replace(/\s+/g, " ").trim();
    return pageText;
  } catch (error) {
    console.error("Error fetching webpage:", error);
    return "Failed to extract content from the webpage.";
  }
};

const extractJobDetails = async (text) => {
  const prompt = `Extract only the job details from the following text. Provide three sections:"The job description" - describe the job opportunity.  
  "What You Will Be Doing" - describe the responsibilities.  
  "What We Are Looking For" - list the required qualifications.  
  Ignore irrelevant information.  
  
  ### Input Text:  
  ${text}  
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "Error processing job details.";
  }
};

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const urls = userMessage.match(urlRegex);

  try {
    // Get the embedding for the user's message
    const queryEmbedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: userMessage,
    });

    // Query Pinecone with the embedding
    const results = await index.query({
      vector: queryEmbedding.data[0].embedding,
      topK: 1,
      includeMetadata: true,
    });

    const context = results.matches.length > 0 ? results.matches[0].metadata.text : "";
    console.log("Context from Pinecone:", context);

    if (urls && urls.length > 0) {
      const url = urls[0];
      console.log("Processing URL:", url);
      const content = await extractWebpageContent(url);
      const jobDetails = await extractJobDetails(content);
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Use the following context including job details and resume context to answer the user's query in Third person: " + context + "\n\nJob Details:\n" + jobDetails },
          { role: "user", content: userMessage },
        ],
      });
      res.json({ message: response.choices[0].message.content });
    } else {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Use the following context to answer the user's query: " + context },
          { role: "user", content: userMessage },
        ],
      });
      res.json({ message: response.choices[0].message.content });
    }
  } catch (error) {
    console.error("Detailed error:", error);
    if (error.response) {
      console.error("API Response:", error.response.data);
    }
    res.status(500).json({ 
      message: "Something went wrong. Please try again.",
      error: error.message 
    });
  }
});

// Remove the Firebase Functions export and instead start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});