from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.concepts import router as concepts_router

app = FastAPI(title="LearningAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(concepts_router)

@app.get("/")
async def root():
    return {"message": "LearningAI API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
