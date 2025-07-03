from fastapi import FastAPI
from routers import anime, torrents, stream
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(anime.router)
app.include_router(torrents.router)
app.include_router(stream.router)

@app.get("/")
async def root():
    return {"message": "404Anime Here"}