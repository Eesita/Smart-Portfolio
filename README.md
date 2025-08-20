# Eesita's AI-Powered Portfolio

An intelligent portfolio website featuring E.V.A. (Eesita's Virtual Assistant), an AI chatbot that uses RAG (Retrieval Augmented Generation) to answer questions about Eesita's experience, skills, and projects. The chatbot can also analyze job descriptions and provide personalized insights.

## 🚀 Features

- **AI Chatbot (E.V.A.)**: Powered by OpenAI GPT-3.5-turbo with RAG framework
- **Resume Analysis**: Automatically extracts and embeds resume content using OpenAI embeddings
- **Job Description Processing**: Analyzes job URLs and provides personalized insights
- **Vector Search**: Uses Pinecone vector database for semantic search
- **Modern UI**: Responsive design with interactive portfolio sections
- **Docker Support**: Containerized for easy deployment
- **Health Check**: Built-in health monitoring endpoint

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **AI/ML**: OpenAI API, Pinecone Vector Database
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap
- **PDF Processing**: PDF.js for resume text extraction
- **Web Scraping**: Cheerio for job description extraction
- **Containerization**: Docker with Alpine Linux

## 📋 Prerequisites

- Node.js 22+
- Docker (optional, for containerized deployment)
- OpenAI API key
- Pinecone API key and index (dimension 1536)

## 🚀 Quick Start

### Option 1: Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd SmartPortfolio
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys:
   # OPENAI_API_KEY=your_openai_key
   # PINECONE_API_KEY=your_pinecone_key
   # PINECONE_INDEX_NAME=your_index_name
   ```

3. **Add your resume:**
   ```bash
   # Place your resume PDF at: public/assets/resume.pdf
   ```

4. **Start the application:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

5. **Access the application:**
   - Portfolio: http://localhost:3000
   - Health Check: http://localhost:3000/health

### Option 2: Docker Deployment

1. **Build and run with Docker:**
   ```bash
   # Make script executable
   chmod +x docker-build.sh
   
   # Build and run
   ./docker-build.sh
   ```

2. **Or manually:**
   ```bash
   # Build image
   docker build -t eesita-portfolio .
   
   # Run container
   docker run -d --name eesita-portfolio -p 3000:3000 --env-file .env eesita-portfolio
   ```

## 🔧 API Endpoints

- `GET /` - Portfolio homepage
- `GET /health` - Health check endpoint
- `POST /chat` - AI chatbot endpoint

### Chat API Example:
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about Eesita\'s experience with AI projects"}'
```

## 📁 Project Structure

```
SmartPortfolio/
├── app.js                 # Main Express server
├── package.json           # Dependencies and scripts
├── Dockerfile            # Docker configuration
├── docker-build.sh       # Docker build script
├── .env                  # Environment variables
├── public/
│   ├── index.html        # Portfolio frontend
│   ├── styles.css        # Custom styles
│   └── assets/
│       └── resume.pdf    # Resume file
└── README.md
```

## 🔍 How It Works

1. **Resume Processing**: On startup, the app extracts text from your resume PDF and creates embeddings using OpenAI
2. **Vector Storage**: Resume embeddings are stored in Pinecone vector database
3. **Chat Interface**: Users can ask questions about your experience or paste job URLs
4. **RAG Response**: The system combines resume context with job analysis to provide personalized responses
5. **Job Analysis**: When a job URL is provided, the system scrapes the job description and analyzes it against your background

## 🚀 Deployment

### AWS ECS (Recommended)
- Push to Amazon ECR
- Deploy using ECS Fargate
- Configure load balancer and domain

### Other Platforms
- **Render**: Set start command to `npm start`
- **Heroku**: Add Node.js buildpack
- **Vercel**: Configure as Node.js application

## 📝 Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
PORT=3000  # Optional, defaults to 3000
NODE_ENV=production  # Optional
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👤 Contact

- **Email**: sen.ee@northeastern.edu
- **LinkedIn**: [Eesita Sen](https://www.linkedin.com/in/eesita-sen-4a0a52169/)
- **GitHub**: [Eesita](https://github.com/Eesita)