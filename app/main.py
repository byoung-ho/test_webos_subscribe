from fastapi import FastAPI

app = FastAPI(title="webOS Subscription Service")

subscriptions = []

@app.get("/")
def root():
    return {"message": "webOS Subscription Service"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/subscriptions")
def get_subscriptions():
    return subscriptions

@app.post("/subscriptions")
def create_subscription(item: dict):
    subscriptions.append(item)
    return {"result": "created", "data": item}