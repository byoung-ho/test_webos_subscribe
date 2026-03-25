# webOS 구독 관리 서비스 — 실습 오리엔테이션

> 연세대학교 DevOps 실습
> 팀 프로젝트 (4인 1조)

---

## 1. System Context

> 아래 다이어그램은 실습에서 구현할 전체 시스템의 구조입니다.
> (별도 제공되는 System Context Diagram 이미지를 참고하세요)

```
  ┌──────────┐      ┌──────────┐
  │ Front End│      │ Back End │
  │ Developer│      │ Developer│
  └────┬─────┘      └────┬─────┘
       │    ① 개발        │
       └───────┬──────────┘
               ▼
       ┌───────────────┐        ┌─────────────────┐
       │   Local Dev   │        │  Test Engineer   │
       │ localhost:8000 │        │                  │
       │ 개발 & 테스트   │        │ · 테스트 시나리오  │
       └───────┬───────┘        │   작성 & 실행     │
               │                │ · 검증 Report     │
               ▼                │   작성            │
       ┌───────────────┐        └────────┬─────────┘
       │    Quality    │                 │
       │               │ ◄───② 검증──────┘
       │ · API 테스트   │
       │ · 시나리오 검증 │
       │ · 실패 시 차단 │
       └───────┬───────┘
               │ 검증 통과
               ▼
       ┌───────────────┐     ┌─────────────────┐
       │    GitHub     │     │ Project Manager  │
       │  Repository   │ ◄───│                  │
       │               │     │ · 요구사항 배분   │
       │ 소스 코드 관리  │     │ · CI/CD 관리     │
       │ 버전 관리      │     │ · 최종 배포 승인  │
       └───────┬───────┘     └─────────────────┘
               │ ③ CI/CD
               ▼
       ┌───────────────┐
       │    Render     │
       │    (CD)       │
       │               │
       │ · 자동 빌드    │
       │ · 자동 배포    │
       └───────┬───────┘
               │ 배포된 서비스
               ▼
       ┌───────────────┐
       │     고객      │
       │   (브라우저)   │
       │               │
       │ HTTPS         │
       │ HTML + JSON   │
       └───────────────┘
```

---

## 2. 팀 구성 및 역할

각 팀은 **4명**으로 구성되며, 아래 역할을 수행합니다.

### Project Manager (PM) — 1명

| 항목 | 내용 |
|------|------|
| **핵심 역할** | 요구사항 관리, 작업 배분, CI/CD 관리, 최종 배포 |
| 요구사항 배분 | 강사로부터 요구사항을 수령하여 개발자에게 기능/비기능 요구사항 전달 |
| 검증 요청 | Test Engineer에게 테스트 시나리오 작성 및 검증 요청 |
| CI 수행 | 검증 통과된 코드를 GitHub Repository에 push (CI) |
| CD 관리 | Render를 통한 배포 확인 및 최종 서비스 URL 관리 |
| 배포 판단 | Test Engineer의 검증 Report를 기반으로 배포 여부 결정 |

### Front End Developer — 1명

| 항목 | 내용 |
|------|------|
| **핵심 역할** | 대시보드 UI 구현 |
| 담당 파일 | `app/static/app.js`, `app/templates/index.html`, `app/static/style.css` |
| 구현 내용 | Table 렌더링, 검색/필터, 상태 Badge, Bar Chart |
| 테스트 | 로컬 브라우저에서 UI 동작 확인 후 PM에게 전달 |

### Back End Developer — 1명

| 항목 | 내용 |
|------|------|
| **핵심 역할** | REST API 구현 |
| 담당 파일 | `app/api/subscribers.py`, `app/api/devices.py` |
| 구현 내용 | GET /api/subscribers, GET /api/subscribers/{id}/devices, GET /api/devices/{id}/usage |
| 테스트 | 로컬에서 API 응답 확인 (브라우저 또는 curl) 후 PM에게 전달 |

### Test Engineer — 1명

| 항목 | 내용 |
|------|------|
| **핵심 역할** | 테스트 시나리오 작성 및 검증 |
| 시나리오 작성 | PM으로부터 요구사항을 받아 테스트 시나리오 작성 |
| 검증 수행 | 개발자가 구현한 기능을 테스트 시나리오 기반으로 검증 |
| Report 작성 | 검증 결과를 Report로 작성하여 PM에게 전달 |
| 배포 후 검증 | Render 배포 후 최종 서비스에서 재검증 |

---

## 3. 업무 흐름

```
강사 (요구사항 전달)
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│  PM                                                             │
│  · 요구사항 수령                                                  │
│  · 기능/비기능 요구사항을 개발자에게 배분                             │
│  · 테스트 시나리오 작성을 Test Engineer에게 요청                     │
└──┬───────────────────────────┬──────────────────────────────────┘
   │                           │
   ▼                           ▼
┌──────────────┐       ┌───────────────┐
│  FE / BE     │       │ Test Engineer  │
│  Developer   │       │               │
│              │       │ 테스트 시나리오  │
│  기능 구현    │       │ 작성           │
│  로컬 테스트  │       │               │
└──────┬───────┘       └───────┬───────┘
       │ 구현 완료              │ 시나리오 준비 완료
       │                       │
       └───────────┬───────────┘
                   ▼
         ┌──────────────────┐
         │  Test Engineer   │
         │                  │
         │  시나리오 기반     │
         │  기능 검증 실행    │
         │         │        │
         │         ▼        │
         │  검증 Report 작성 │
         └────────┬─────────┘
                  │ Report 전달
                  ▼
         ┌──────────────────┐
         │  PM              │
         │                  │
         │  Report 검토     │
         │  통과 → GitHub   │
         │  push (CI)       │
         │       │          │
         │       ▼          │
         │  Render 배포 (CD)│
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  고객 (서비스)    │
         │  Render URL 접속  │
         └──────────────────┘
```

### 핵심 원칙

> **검증 없이 배포하지 않는다.**
>
> PM은 Test Engineer의 검증 Report 결과를 확인한 후에만
> GitHub에 push(CI)하고 Render에 배포(CD)합니다.
> 이것이 실무에서의 품질 관리(Quality Gate)입니다.

---

## 4. 기술 스택

| 구분 | 기술 |
|------|------|
| Backend | Python + FastAPI |
| Frontend | HTML + Vanilla JS + Chart.js |
| Template | Jinja2 |
| CI | GitHub (수동 push → 이후 GitHub Actions 자동화) |
| CD | Render (GitHub 연동 자동 배포) |

---

## 5. 프로젝트 구조

> PM이 Skeleton 압축 파일을 개발자에게 제공합니다.

```
skeleton/
├── app/
│   ├── main.py                  # FastAPI 앱 진입점         (제공됨)
│   ├── api/
│   │   ├── subscribers.py       # 구독자 API               (구현 대상 - BE)
│   │   └── devices.py           # 가전 API                 (구현 대상 - BE)
│   ├── data/
│   │   └── dummy_data.py        # 더미 데이터               (제공됨)
│   ├── templates/
│   │   └── index.html           # HTML 템플릿               (제공됨)
│   └── static/
│       ├── style.css            # 스타일시트                 (제공됨)
│       └── app.js               # 프론트엔드 로직            (구현 대상 - FE)
├── requirements.txt             # Python 의존성              (제공됨)
└── .gitignore                   # Git 제외 목록              (제공됨)
```

---

## 6. API 명세

| Method | Endpoint | 설명 | 담당 |
|--------|----------|------|------|
| GET | `/api/subscribers` | 전체 구독 사용자 목록 조회 | BE |
| GET | `/api/subscribers/{userId}/devices` | 특정 사용자의 가전 목록 조회 | BE |
| GET | `/api/devices/{deviceId}/usage` | 특정 가전의 상세 사용 현황 조회 | BE |
| GET | `/health` | 서버 상태 확인 | 제공됨 |

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

## 9. 최종 결과물

각 팀은 실습 종료 시 아래 **3가지**를 제출합니다.

| # | 결과물 | 설명 | 담당 |
|---|--------|------|------|
| 1 | **GitHub Repository** | 전체 소스 코드 (CI 완료 상태) | PM |
| 2 | **검증 Report** | 테스트 시나리오 + 결과 (Pass/Fail) | Test Engineer |
| 3 | **Render 배포 URL** | 최종 서비스 접속 가능한 URL | PM |

### 검증 Report 양식 (예시)

```
┌──────────────────────────────────────────────────────────────────┐
│  검증 Report — 팀 __조                                           │
├──────┬───────────────────────────┬──────┬────────┬──────────────┤
│  #   │ 테스트 시나리오             │ 결과 │ 상태   │ 비고          │
├──────┼───────────────────────────┼──────┼────────┼──────────────┤
│  1   │ /api/subscribers 호출 시   │ Pass │ 완료   │ 5명 반환 확인  │
│      │ 전체 사용자 목록 반환       │      │        │              │
├──────┼───────────────────────────┼──────┼────────┼──────────────┤
│  2   │ 사용자 이름 검색 시         │ Pass │ 완료   │              │
│      │ 필터링 결과 표시            │      │        │              │
├──────┼───────────────────────────┼──────┼────────┼──────────────┤
│  3   │ 존재하지 않는 사용자 ID     │ Pass │ 완료   │ 404 응답 확인 │
│      │ 조회 시 404 에러           │      │        │              │
├──────┼───────────────────────────┼──────┼────────┼──────────────┤
│  ... │ ...                       │      │        │              │
└──────┴───────────────────────────┴──────┴────────┴──────────────┘
```

---

## 10. 실습 진행 순서

```
┌─────────────────────────────────────────────────────────────────┐
│  오리엔테이션                                                     │
│  · System Context 설명                                           │
│  · 팀 구성 및 역할 배정                                            │
│  · 프로젝트 구조 설명                                              │
│  · PM에게 Skeleton 압축 파일 전달                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│  환경 셋업                                                        │
│  · PM: Skeleton → GitHub Repository 생성 → Render 연동            │
│  · 개발자: Repository clone → 로컬 환경 구성                        │
│  · Test Engineer: 요구사항 확인 → 테스트 시나리오 작성 준비            │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│  요구사항 #1 — 구독 사용자 조회 + 검색/필터 (4.1 + 4.2)             │
│  · PM: 요구사항을 BE/FE에 배분, TE에 시나리오 요청                   │
│  · BE: GET /api/subscribers 구현                                  │
│  · FE: Table 렌더링 + 검색/필터 구현                                │
│  · TE: 테스트 시나리오 작성 → 검증 → Report                         │
│  · PM: Report 확인 → GitHub push (수동 CI) → Render 배포 (자동 CD) │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│  요구사항 #2 — 가전 목록 + 사용 현황 + 차트 (4.3~4.6)               │
│  · BE: GET /subscribers/{id}/devices + GET /devices/{id}/usage   │
│  · FE: 가전 Table + 사용 현황 상세 + Bar Chart                     │
│  · TE: 검증 → Report                                             │
│  · PM: feature 브랜치 → PR → merge 워크플로우                      │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│  요구사항 #3 — 상태 Badge + GitHub Actions CI (4.7 + 4.8)         │
│  ⚡ 요구사항 #2 진행 중에 전달 (실무 시뮬레이션)                      │
│  · FE: badgeClass() 상태 색상 구현                                 │
│  · PM: GitHub Actions CI 설정 + 최종 배포                          │
│  · TE: 색상 검증 + CI 파이프라인 검증 → 최종 Report                  │
│  · 브랜치 관리 및 충돌 해결 체험                                     │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│  최종 제출                                                        │
│  · GitHub Repository URL                                         │
│  · 검증 Report (전체 요구사항)                                     │
│  · Render 배포 URL                                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 11. 로컬 실행 방법

```bash
# 1. 의존성 설치
pip install -r requirements.txt

# 2. 서버 실행
uvicorn app.main:app --reload

# 3. 브라우저에서 확인
# http://localhost:8000         → 대시보드
# http://localhost:8000/health  → {"status": "ok"}

# 4. API 직접 호출 테스트
# http://localhost:8000/api/subscribers
```
