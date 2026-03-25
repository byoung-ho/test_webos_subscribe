# DevOps 실습 강의 진행 가이드

> 연세대학교 DevOps 강의 (총 4시간)
> 대상: 연세대학교 학생

---

## 전체 타임라인

```
1부: DevOps 강의 (1~2시간)
DevOps 개념 / CI·CD 이론 / Git 워크플로우 / 도구 소개

── 휴식 (10분) ── 

2부: DevOps 실습 (2~3시간)
Setup  -> 요구사항 #1  -> 요구사항 #2  -> 요구사항 #3  -> 마무리
 25분      40분           40분           30분          15분
                                     (#3은 #2 진행 중 전달)
```

---

## 1부: DevOps 강의 (1~2시간)

> 이 부분은 강사가 슬라이드로 진행합니다.
> 아래는 실습과 연계되는 핵심 토픽입니다.

### 추천 강의 구성

| 순서 | 토픽 | 시간 | 실습 연계 |
|------|------|------|----------|
| 1 | DevOps란? (문화, 원칙, 가치) | 15분 | - |
| 2 | CI/CD 개념과 파이프라인 | 20분 | 실습 전체 |
| 3 | Git 기초 + 브랜치 전략 | 20분 | 요구사항 #2 |
| 4 | GitHub Actions 소개 | 15분 | 요구사항 #3 |
| 5 | 클라우드 배포 (Render) | 10분 | 요구사항 #1 |
| 6 | 실습 프로젝트 소개 + Q&A | 10분 | - |

### 강조 포인트
- "코드를 작성하는 것"이 아니라 "코드를 안전하게 전달하는 것"이 DevOps의 핵심
- 수동 CI → 자동 CI 전환을 직접 체험하게 될 것
- 실습 중 요구사항이 중간에 추가되는 상황도 의도된 것임을 미리 암시

---

## 2부: DevOps 실습 (2~3시간)

---

### a. System Context 설명 (10분)

#### 강사 행동
1. `system_context.md`를 화면에 공유 (또는 PDF 출력물 배포)
2. System Context Diagram을 보며 전체 구조 설명

#### 설명 포인트

```
"여러분은 webOS 구독 관리 서비스의 개발자입니다.
 이 서비스는 FastAPI로 만들어진 단일 웹 앱이고,
 Local개발 → GitHub → Render 파이프라인으로 배포됩니다.

 오늘 실습에서는:
 ① Local에서 개발하고
 ② GitHub에 push하면
 ③ 수동/자동으로 테스트가 돌고
 ④ 통과하면 자동으로 배포됩니다.

 이 흐름을 직접 체험하게 됩니다."
```

#### 배포 자료
- `docs/system_context.md` 공유 (GitHub 또는 출력물)

---

### b. 환경 셋업 (15분)

#### 강사 행동
1. 사전 준비 체크리스트를 화면에 표시
2. 학생들이 따라하도록 안내
3. 막히는 학생 개별 지원

#### 학생 실습 순서

```bash
# ── 1. 사전 준비 확인 ──
python --version       # Python 3.9+ 확인
git --version          # Git 설치 확인

# ── 2. GitHub 계정 확인 ──
# GitHub 계정이 없으면 가입: https://github.com

# ── 3. 프로젝트 Fork + Clone ──
# GitHub에서 강사 리포지토리를 Fork
# (강사가 skeleton 프로젝트를 미리 push 해둔 리포지토리)

git clone https://github.com/{학생계정}/test_webos_subscribe.git
cd test_webos_subscribe

# ── 4. 의존성 설치 ──
pip install -r requirements.txt

# ── 5. 서버 실행 확인 ──
uvicorn app.main:app --reload

# ── 6. 브라우저에서 확인 ──
# http://localhost:8000         → 대시보드 (빈 화면)
# http://localhost:8000/health  → {"status": "ok"}
```

#### Render 연동

```
1. https://render.com 에 GitHub 계정으로 로그인
2. "New" → "Web Service" 선택
3. Fork한 리포지토리 연결
4. 설정:
   - Name: webos-subscribe-{학생이름}
   - Runtime: Python 3
   - Build Command: pip install -r requirements.txt
   - Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
5. "Create Web Service" 클릭
6. 배포 완료 후 제공되는 URL 확인
   → https://webos-subscribe-{이름}.onrender.com/health
```

#### 체크포인트
- [ ] `localhost:8000/health` 응답 확인
- [ ] Render 배포 URL에서 `/health` 응답 확인
- [ ] 대시보드 페이지 빈 화면 확인 (아직 API 미구현)

---

### c. 요구사항 #1 전달 + 수동 CI + Render CD (40분)

#### 강사 행동
1. `requirement_1.md` 배포
2. 핵심 설명:

```
"첫 번째 요구사항입니다.
 구독 사용자 목록을 조회하는 API를 만들고, 화면에 Table로 표시하세요.

 완성하면:
 1. 로컬에서 직접 테스트하세요 (이것이 '수동 CI')
 2. git push 하세요
 3. Render에서 자동 배포되는지 확인하세요 (이것이 '자동 CD')

 지금은 GitHub Actions 없이 진행합니다.
 여러분이 직접 눈으로 확인하는 것이 수동 CI입니다."
```

#### 학생 실습 (목표: 35분)

| 단계 | 작업 | 예상 시간 |
|------|------|----------|
| 1 | `subscribers.py` - GET /api/subscribers 구현 | 5분 |
| 2 | `app.js` - fetchSubscribers() 구현 | 5분 |
| 3 | `app.js` - renderSubscribers() 구현 | 10분 |
| 4 | 이벤트 리스너 주석 해제 + fetchSubscribers() 주석 해제 | 2분 |
| 5 | 로컬 테스트 (수동 CI) | 3분 |
| 6 | git add → commit → push | 5분 |
| 7 | Render 배포 확인 (자동 CD) | 5분 |

#### 강사 멘트 (수동 CI 설명)

```
"지금 여러분이 한 것을 정리하면:

 [수동 CI]
 - 로컬에서 서버 실행하고
 - 브라우저에서 API 응답 확인하고
 - 화면이 제대로 나오는지 눈으로 확인했습니다
 → 이것이 수동 CI입니다. 사람이 직접 검증하는 것.

 [자동 CD]
 - git push만 했는데 Render가 알아서 배포했습니다
 → 이것이 자동 CD입니다. push하면 배포까지 자동.

 하지만 수동 CI의 문제점은?
 → 테스트를 안 하고 push할 수도 있다
 → 실수로 깨진 코드가 바로 배포될 수 있다
 → 이걸 나중에 GitHub Actions로 해결합니다."
```

#### 체크포인트
- [ ] 대시보드에 구독자 5명 Table 표시
- [ ] 검색, 상태 필터 동작
- [ ] Render URL에서도 동일하게 동작

---

### d. 요구사항 #2 전달 (40분)

#### 강사 행동
1. `requirement_2.md` 배포
2. 핵심 설명:

```
"두 번째 요구사항입니다.
 가전 목록 조회 + 사용 현황 + 차트까지 한 번에 구현합니다.
 이번에는 feature 브랜치를 만들어서 작업하세요.

 실무에서는 main 브랜치에 직접 push하지 않습니다.
 feature 브랜치 → Pull Request → 코드 리뷰 → merge
 이 워크플로우를 직접 체험해보세요."
```

#### 팀별 실습 (목표: 35분)

| 단계 | 역할 | 작업 | 예상 시간 |
|------|------|------|----------|
| 1 | PM | `git checkout -b feature/devices-api` | 1분 |
| 2 | BE | `subscribers.py` - GET /subscribers/{id}/devices 구현 | 5분 |
| 3 | BE | `devices.py` - GET /devices/{id}/usage 구현 | 5분 |
| 4 | FE | `app.js` - selectSubscriber() + renderDevices() 구현 | 10분 |
| 5 | FE | `app.js` - selectDevice() + renderUsageChart() 구현 | 8분 |
| 6 | TE | 테스트 시나리오 작성 + 구현 완료 후 검증 | 병렬 |
| 7 | PM | TE Report 확인 → git push → PR 생성 | 5분 |

#### 강사 멘트 (PR 아직 merge하지 말라고 안내)

```
"PR을 만들었으면 잠시 멈추세요.
 아직 merge하지 마세요.
 곧 새로운 요구사항이 들어옵니다."
```

---

### e. 요구사항 #3 전달 — 요구사항 #2 진행 중 (30분)

> **타이밍이 핵심입니다.**
> 팀들이 요구사항 #2를 아직 진행 중이거나, PR을 막 만든 시점에 전달합니다.

#### 강사 행동
1. `requirement_3.md` 배포
2. 핵심 설명:

```
"자, 새로운 요구사항이 들어왔습니다.
 '상태 Badge 색상 + GitHub Actions CI 설정' 입니다.

 실무에서도 이렇게 기능 개발 중에 새 요구사항이 들어옵니다.
 PM은 이 요구사항을 팀원에게 어떻게 배분할지 판단하세요.

 지금 feature/devices-api 브랜치에서 작업 중이라면,
 → 현재 작업을 커밋(또는 stash)하고
 → main으로 돌아가서
 → 새 브랜치를 만들어 작업하세요

 이것이 브랜치 전략의 핵심입니다."
```

#### 팀별 실습 (목표: 25분)

| 단계 | 역할 | 작업 | 예상 시간 |
|------|------|------|----------|
| 1 | PM | 현재 작업 커밋 또는 `git stash` | 2분 |
| 2 | PM | `git checkout main` → `git checkout -b feature/status-badge-ci` | 1분 |
| 3 | FE | `app.js` - badgeClass() 구현 | 5분 |
| 4 | PM | `.github/workflows/ci.yml` 생성 | 5분 |
| 5 | TE | 색상 검증 시나리오 추가 + 검증 | 병렬 |
| 6 | PM | TE Report 확인 → git push → PR 생성 | 3분 |

#### 브랜치 상태 설명

```
"지금 여러분의 리포지토리에는 3개의 브랜치가 있습니다:

 main ─────────────────────────────
   │                    │
   ├─ feature/devices-api    (요구사항 #2)
   │
   └─ feature/status-badge-ci (요구사항 #3)

 두 브랜치 모두 app.js를 수정했습니다.
 이제 하나씩 merge하면... 충돌이 발생할 수 있습니다.
 이것도 실무에서 자주 일어나는 일입니다."
```

#### PR Merge 안내

```
"이제 PM이 PR을 merge해봅시다.
 1. 먼저 요구사항 #2 PR을 merge하세요
 2. 그 다음 요구사항 #3 PR을 merge하세요
    → conflict가 발생하면 팀원과 협력하여 해결하세요

 conflict가 발생하는 건 잘못이 아닙니다.
 여러 사람이 같은 파일을 수정하면 자연스럽게 발생하는 것이고,
 이를 안전하게 해결하는 것이 팀의 역할입니다."
```

#### 강사 멘트 (CI 자동화 의미)

```
"GitHub Actions 탭을 보세요.
 merge하자마자 자동으로 테스트가 돌고 있습니다.

 이것이 자동 CI입니다.
 아까 수동으로 하던 것(서버 켜고, curl 날리고, 확인하고)을
 GitHub가 대신 해줍니다.

 만약 테스트가 실패하면?
 → 배포가 차단됩니다
 → 깨진 코드가 고객에게 전달되지 않습니다

 이것이 CI/CD 파이프라인의 핵심 가치입니다."
```

#### 체크포인트
- [ ] 두 PR 모두 merge 완료
- [ ] 충돌 해결 경험 (app.js)
- [ ] GitHub Actions CI 자동 실행 확인
- [ ] Render에서 3개 패널 모두 동작 + 상태 색상 확인

---

### f. 마무리 (15분)

#### 강사 행동

1. **전체 파이프라인 시연**

```
"오늘 여러분 팀이 만든 전체 파이프라인을 정리하겠습니다."

 FE/BE 개발 (Local Dev)
   ↓
 TE 검증 (테스트 시나리오 Report)
   ↓
 PM: git commit + push
   ↓
 GitHub Actions (CI)        ← 자동 테스트
   ├─ 코드 체크아웃
   ├─ Python 환경 설정
   ├─ 의존성 설치
   ├─ 문법 검사
   └─ API 엔드포인트 테스트
   ↓
 CI 통과 ✅
   ↓
 Render (CD)                ← 자동 배포
   ↓
 고객이 배포 URL에서 서비스 이용
```

2. **수동 vs 자동 비교**

```
"처음에는 이랬습니다:"

 [요구사항 #1] 수동 CI
  - TE가 로컬에서 직접 확인
  - PM이 눈으로 Report 확인 후 push
  → 사람이 까먹으면 테스트 안 하고 push 가능

"지금은 이렇게 바뀌었습니다:"

 [요구사항 #3] 자동 CI
  - push하면 GitHub Actions가 자동 실행
  - 서버 기동 + API 테스트 자동
  - 실패하면 merge 차단 가능
  → 사람이 실수해도 시스템이 잡아줌
```

3. **실무 확장 이야기 (선택)**

```
"실무에서는 여기에 더 많은 것이 추가됩니다:"

  · 단위 테스트 (pytest)
  · 코드 품질 검사 (flake8, black)
  · 보안 검사 (dependency audit)
  · Docker 빌드
  · 스테이징 환경 → 프로덕션 환경 분리
  · 모니터링 + 알림

"하지만 오늘 체험한 것이 그 모든 것의 기본 뼈대입니다."
```

4. **Q&A + 마무리**

```
"질문 있으신 분?"

"오늘 핵심 3가지:
 1. CI/CD는 '코드를 안전하게 전달하는 파이프라인'이다
 2. 브랜치 전략은 '여러 명이 동시에 안전하게 작업하는 방법'이다
 3. 자동화는 '사람의 실수를 시스템이 잡아주는 것'이다

 수고하셨습니다!"
```

---

## 강사용 체크리스트

### 사전 준비
- [ ] skeleton 프로젝트를 GitHub 리포지토리에 push
- [ ] Render에 샘플 배포 테스트 완료
- [ ] 완성본(정답) 리포지토리 별도 준비 (학생 참고용)
- [ ] 각 요구사항 문서 인쇄 또는 공유 링크 준비
- [ ] System Context 문서 인쇄 또는 PDF 준비

### 실습 중 주의사항
- [ ] 요구사항 #3은 반드시 #2 진행 중에 전달 (타이밍 중요 — 실무 시뮬레이션의 핵심)
- [ ] 환경 셋업에서 막히는 학생이 많을 수 있음 → 여유 시간 확보
- [ ] Render 무료 tier는 배포 후 첫 접속이 느릴 수 있음 → 사전 안내
- [ ] conflict 해결에 어려움을 겪는 학생에게 개별 지원 필요

### 진행 속도 조절
- 빠른 학생: 요구사항 문서의 선택 과제를 미리 진행
- 느린 학생: 코드 힌트를 추가 제공 (정답 코드 일부 공유)
- 전체적으로 느리면: 요구사항 #3의 badgeClass 구현은 건너뛰고 CI 설정에 집중

---

## 배포 자료 목록

| 자료 | 배포 시점 | 형태 |
|------|----------|------|
| `system_context.md` | 실습 시작 전 (a단계) | PDF 또는 MD (GitHub) |
| skeleton 프로젝트 | 환경 셋업 시 (b단계) | GitHub 리포지토리 (Fork) |
| `orientation.md` | 실습 시작 전 (a단계) | PDF 또는 MD (GitHub) |
| `requirement_1.md` | c단계 시작 시 | MD (GitHub) 또는 인쇄물 |
| `requirement_2.md` | d단계 시작 시 | MD (GitHub) 또는 인쇄물 |
| `requirement_3.md` | e단계 시작 시 (**#2 진행 중**) | MD (GitHub) 또는 인쇄물 |
