from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.utils.logger import init_logger
from app.routes import service, text, document

init_logger()

api = FastAPI(
    title="Document Simplification API",
    description="API for simplifying documents using Azure OpenAI",
    version="1.0.0"
)

api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

api.include_router(service.router)
api.include_router(text.router)
api.include_router(document.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:api", host="0.0.0.0", port=5000, reload=True)
