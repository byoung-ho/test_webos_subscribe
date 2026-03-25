# webOS 구독 관리 서비스 - System Context

연세대학교 DevOps 실습을 위한 가상의 구독 관리 서비스입니다.

---

## 1. System Context Diagram

```
                                          ┌─────────────────────┐
                                          │  GitHub Repository   │
                                          │                      │
                                git push  │  소스 코드 관리       │
                              ┌─────────→│  버전 관리            │
                              │           └──────────┬───────────┘
                              │                      │
                              │               ② CI   │ push 이벤트
                              │                      │ 트리거
                              │                      ▼
  ④ 서비스                    │           ┌─────────────────────┐
                              │           │  GitHub Actions (CI) │
  Student/       HTTPS        │           │                      │
  Operator  ◄──────────►  ┌───┴───────┐  │  · API 테스트         │
  (브라우저)   HTML+JSON   │  webOS     │  │  · Health 검증       │
                           │  Subscrip- │  │  · 실패 시 배포 차단  │
                           │  tion      │  └──────────┬──────────┘
   localhost:8000          │  Service   │             │
  · · · · · · · · · · ►   │           │      ③ CD   │ CI 성공 시
                           │ (FastAPI + │             │ 자동 배포
  ┌──────────────┐         │  HTML/JS)  │             │ 트리거
  │  Local Dev   │         │           │             ▼
  │              │  ① 개발  │ · REST API │  ┌─────────────────────┐
  │ localhost:   ├────────→│ · 대시보드  │  │  Render (CD)         │
  │ 8000         │         │ · 더미 데이터│◄┤                      │
  │ 개발 & 테스트 │         │   (JSON)   │  │  · 자동 빌드          │
  └──────────────┘         └───────────┘  │  · 자동 배포          │
                              ▲           │  · Free Tier 호스팅   │
                              │           └─────────────────────┘
                              │  배포된 서비스
                              └───────────────────────┘
```

---

## 2. 구성 요소

| 구성 요소 | 역할 |
|-----------|------|
| **사용자 (Student/Operator)** | 브라우저를 통해 대시보드 접속, 구독자/가전 조회 및 검색 |
| **FastAPI 서비스** | REST API 제공 + HTML 대시보드 서빙, 내장 JSON 더미 데이터 사용 (외부 DB 없음) |
| **GitHub Repository** | 소스 코드 버전 관리, push 이벤트가 CI/CD 트리거 |
| **GitHub Actions (CI)** | push 시 API 테스트 및 health 검증 자동 실행, 실패 시 배포 차단 |
| **Render (CD)** | GitHub 연동으로 main 브랜치 push 시 자동 빌드/배포 |

---

## 3. 핵심 흐름

```
① 개발    → 로컬에서 FastAPI 개발 및 테스트 (localhost:8000)
② CI      → git push → GitHub Actions가 API 테스트/health 검증 실행
③ CD      → CI 통과 후 Render가 자동으로 빌드 및 배포
④ 서비스   → Render URL로 실제 서비스 접속 가능
```

> 외부 DB나 메시지 큐 없이 **단일 서비스 + 내장 더미 데이터** 구조이므로,
> 학생들이 **DevOps 파이프라인(CI/CD) 자체에 집중**할 수 있는 구성입니다.

---

## 4. 기술 스택

| 구분 | 기술 |
|------|------|
| Backend | Python + FastAPI |
| Frontend | HTML + Vanilla JS + Chart.js |
| Template | Jinja2 |
| CI | GitHub Actions |
| CD | Render (자동 배포) |

---

## 5. 프로젝트 구조

```
app/
├── main.py                  # FastAPI 앱 진입점 (제공됨)
├── api/
│   ├── subscribers.py       # 구독자 API (구현 대상)
│   └── devices.py           # 가전 API (구현 대상)
├── data/
│   └── dummy_data.py        # 더미 데이터 (제공됨)
├── templates/
│   └── index.html           # HTML 템플릿 (제공됨)
└── static/
    ├── style.css            # 스타일시트 (제공됨)
    └── app.js               # 프론트엔드 로직 (구현 대상)
requirements.txt             # Python 의존성 (제공됨)
.gitignore                   # Git 제외 목록 (제공됨)
```

---

## 6. API 명세

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/subscribers` | 전체 구독 사용자 목록 조회 |
| GET | `/api/subscribers/{userId}/devices` | 특정 사용자의 가전 목록 조회 |
| GET | `/api/devices/{deviceId}/usage` | 특정 가전의 상세 사용 현황 조회 |
| GET | `/health` | 서버 상태 확인 |

---

## 7. 데이터 구조

### Subscriber (구독 사용자)
| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| userId | string | 사용자 고유 ID | U001 |
| name | string | 사용자 이름 | Kim Minsoo |
| organization | string | 소속 | Yonsei University |
| plan | string | 구독 플랜 | Premium / Basic / Family |
| status | string | 구독 상태 | Active / Paused / Expired |
| deviceCount | number | 등록 가전 수 | 2 |

### Device (가전)
| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| deviceId | string | 가전 고유 ID | D001 |
| type | string | 가전 유형 | TV, Washer, Refrigerator |
| model | string | 모델명 | LG OLED evo C4 |
| location | string | 설치 위치 | Dormitory, Home |
| status | string | 상태 | Online / Offline / Standby / Error |
| lastSeen | string | 마지막 통신 시간 | 2026-03-22 10:20:00 |

### Usage (사용 현황)
| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| deviceId | string | 가전 고유 ID | D001 |
| deviceName | string | 가전 이름 | LG OLED evo C4 |
| powerStatus | string | 전원 상태 | On / Off / Standby / Error |
| lastUsedAt | string | 최근 사용 시간 | 2026-03-22 10:10:00 |
| totalUsageHours | number | 누적 사용 시간 | 152 |
| weeklyUsageCount | number | 주간 사용 횟수 | 18 |
| healthStatus | string | 상태 | Normal / Warning |
| remark | string | 비고 | Streaming service active |
| weeklyUsageTrend | number[] | 요일별 사용량 [Mon~Sun] | [2, 3, 1, 4, 2, 3, 3] |

---

## 8. 상태 색상 규칙

| 상태 값 | 색상 | 적용 위치 |
|---------|------|----------|
| Active / Online / Normal | 초록 | 구독 상태, 가전 상태, 건강 상태 |
| Paused / Standby | 파랑 | 구독 상태, 가전 상태, 전원 상태 |
| Expired / Error / Warning | 빨강 | 구독 상태, 가전 상태, 건강 상태 |
| Offline | 회색 | 가전 상태 |

---

## 9. 로컬 실행 방법

```bash
# 1. 의존성 설치
pip install -r requirements.txt

# 2. 서버 실행
uvicorn app.main:app --reload

# 3. 브라우저에서 확인
# http://localhost:8000

# 4. API 직접 호출 테스트
# http://localhost:8000/api/subscribers
# http://localhost:8000/health
```
