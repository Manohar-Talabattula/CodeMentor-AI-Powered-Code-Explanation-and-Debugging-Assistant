from app.routes.chat_routes import router as chat_router
from app.routes.document_routes import router as document_router
from app.routes.code_routes import router as code_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CodeMentor API",
    description="AI-powered Code Explanation and Debugging Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register code assistant routes
app.include_router(code_router)
app.include_router(document_router)
app.include_router(chat_router)

@app.get("/")
def home():
    return {"message": "Welcome to CodeMentor API"}


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "message": "CodeMentor backend is running!"
    }
