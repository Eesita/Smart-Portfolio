# VectorVita

VectorVita is an AI-powered resume and job-matching application. It uses OpenAI for natural language processing and Pinecone for vector search, enabling smart matching between your resume and job descriptions.

## Features
- Extracts and embeds your resume using OpenAI embeddings
- Stores and searches resume vectors in Pinecone
- Matches job descriptions to your resume using semantic search
- REST API endpoint for chat/job matching
- Ready for deployment on Render or any Node.js hosting

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- OpenAI API key
- Pinecone API key and index (dimension 1536)

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd VectorVita
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following:
   ```env
   OPENAI_API_KEY=your_openai_key
   PINECONE_API_KEY=your_pinecone_key
   PINECONE_ENVIRONMENT=us-east-1
   PINECONE_PROJECT_ID=your_project_id
   PINECONE_INDEX_NAME=your_index_name
   ```
4. Place your resume PDF at `public/assets/resume.pdf`.

### Running Locally
```bash
node index.js
```
The server will start on `http://localhost:3000` (or the port set in your environment).

### API Endpoint
- `POST /chat` — Send a message or job description to match against your resume.

#### Example request:
```json
{
  "message": "Paste a job description or question here."
}
```

### Deployment (Render)
1. Push your code to GitHub (do NOT include your `.env` file).
2. Create a new Web Service on [Render](https://dashboard.render.com/).
3. Set your environment variables in the Render dashboard.
4. Set the start command to `node index.js`.

## License
MIT