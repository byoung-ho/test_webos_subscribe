"""
구독 사용자 관련 API 라우터

[4.1] 구독 사용자 조회
- 전체 구독 사용자 목록을 Table 형태로 제공
- 초기 페이지 진입 시 자동 조회
- 응답 필드: userId, name, plan, status, deviceCount

[4.2] 사용자 검색 및 필터 (프론트엔드 처리)
- 이름 / 플랜 / 상태 / ID 기준 검색
- 상태 필터: Active, Paused, Expired
- 검색 결과 실시간 반영

[4.3] 사용자 선택 시 가전 목록 조회
- 사용자 클릭 시 해당 사용자의 가전 목록 반환
- 가전이 없는 경우 빈 배열 반환 (프론트엔드에서 안내 메시지 표시)
- 응답 필드: deviceId, type, model, location, status

[4.7] 상태 기반 UI 표현 (프론트엔드 처리)
- Active → 초록, Paused → 파랑, Expired → 빨강
"""

from fastapi import APIRouter, HTTPException
from app.data.dummy_data import subscribers, devices_by_user

router = APIRouter()


# [4.1] GET /api/subscribers
# 전체 구독 사용자 목록 조회
# - 페이지 진입 시 자동 호출되어 Table에 표시
# - 응답: [{userId, name, plan, status, deviceCount}, ...]
# [4.2] 검색/필터는 프론트엔드에서 이 응답 데이터를 기반으로 처리
@router.get("/subscribers")
def get_subscribers():
    return subscribers


# [4.3] GET /api/subscribers/{user_id}/devices
# 특정 구독자의 등록 가전 목록 조회
# - 사용자 선택(클릭) 시 호출
# - 응답: [{deviceId, type, model, location, status, lastSeen}, ...]
# - 가전이 없는 경우 빈 배열([]) 반환
# - 존재하지 않는 사용자 ID인 경우 404 에러 반환
# [4.4] 가전 검색/필터(모델명, 타입, 상태, 위치)는 프론트엔드에서 처리
@router.get("/subscribers/{user_id}/devices")
def get_devices_by_user(user_id: str):
    for subscriber in subscribers:
        if subscriber["userId"] == user_id:
            return devices_by_user.get(user_id, [])
    raise HTTPException(status_code=404, detail="Subscriber not found")