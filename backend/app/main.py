from fastapi import FastAPI

app = FastAPI(
    title="EVM Project Dashboard API",
    version="1.0.0",
    docs_url="/api-docs",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}