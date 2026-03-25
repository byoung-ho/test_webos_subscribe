"""
가전 디바이스 관련 API 라우터

[4.5] 가전 상세 사용 현황 조회
- 특정 가전 선택 시 사용 현황 표시
- 응답 필드: powerStatus, lastUsedAt, totalUsageHours,
             weeklyUsageCount, healthStatus, remark

[4.6] 사용 현황 시각화 (프론트엔드 처리)
- weeklyUsageTrend 배열(Mon~Sun)을 Bar Chart로 표현
- 요일 기준 데이터 표시

[4.7] 상태 기반 UI 표현 (프론트엔드 처리)
- Online → 초록, Standby → 파랑, Error → 빨강, Offline → 회색
"""

from fastapi import APIRouter, HTTPException
from app.data.dummy_data import usage_by_device

router = APIRouter()


# [4.5] GET /api/devices/{device_id}/usage
# 특정 가전의 상세 사용 현황 조회
# - 가전 선택(클릭) 시 호출
# - 응답 필드:
#   - powerStatus: 전원 상태 (On, Off, Standby, Error, Cleaning 등)
#   - lastUsedAt: 최근 사용 시간
#   - totalUsageHours: 누적 사용 시간 (시간 단위)
#   - weeklyUsageCount: 주간 사용 횟수
#   - healthStatus: 상태 (Normal, Warning)
#   - remark: 비고
# [4.6] weeklyUsageTrend: 주간 사용량 배열 [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
#   - 프론트엔드에서 Bar Chart로 시각화
# - 존재하지 않는 디바이스 ID인 경우 404 에러 반환
@router.get("/devices/{device_id}/usage")
def get_device_usage(device_id: str):
    usage = usage_by_device.get(device_id)
    if not usage:
        raise HTTPException(status_code=404, detail="Device not found")
    return usage