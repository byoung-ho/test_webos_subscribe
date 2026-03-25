"""
webOS 구독 서비스 메인 애플리케이션

[4.8] API 제공 - 시스템은 다음 JSON API를 제공한다:
  - GET /api/subscribers              → 전체 구독 사용자 목록 조회 [4.1]
  - GET /api/subscribers/{userId}/devices → 특정 사용자의 가전 목록 조회 [4.3]
  - GET /api/devices/{deviceId}/usage    → 특정 가전의 상세 사용 현황 조회 [4.5]
"""

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.api import subscribers, devices

app = FastAPI(title="webOS Subscription Service")

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# [4.8] API 라우터 등록
# - /api/subscribers: 구독 사용자 조회 [4.1], 검색/필터 [4.2], 가전 조회 [4.3]
# - /api/devices: 가전 사용 현황 조회 [4.5], 시각화 데이터 [4.6]
app.include_router(subscribers.router, prefix="/api", tags=["Subscribers"])
app.include_router(devices.router, prefix="/api", tags=["Devices"])


@app.get("/", response_class=HTMLResponse)
def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/health")
def health():
    return {"status": "ok"}