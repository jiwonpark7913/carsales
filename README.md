# Carsales 

현대자동차 모델을 살펴보고 차량 구매·교체 관련 상담을 신청할 수 있는 **반응형 웹사이트**입니다. 사용자가 차량 정보를 탐색한 뒤 상담 요청을 남기면, 해당 정보가 **Supabase PostgreSQL**에 저장되도록 구성했습니다.

> 개인 학습·시연용 프로젝트입니다. 현대자동차의 공식 웹사이트나 공식 상담 서비스가 아닙니다. 실제 운영 전 개인정보 처리 안내, 보관·삭제 정책, 운영자 정보 및 스팸 방지 대책을 마련해야 합니다.

## 웹사이트 미리보기

- **[웹사이트 UI 미리보기 (GitHub Pages)](https://jiwonpark7913.github.io/carsales/)**

## 프로젝트 목적

- 카마스터의 고객 관리 창구
- 차량 사진과 모델 정보를 한곳에서 제공하여 차량 탐색을 돕습니다.
- 연령대별 차량 추천과 상담 주제 선택으로 상담 진입을 쉽게 만듭니다.
- 상담 신청 정보를 구조화하여 데이터베이스에 저장하고 후속 상담에 활용할 수 있도록 합니다.
- 추후 익명 클릭 통계와 상담 관리 기능을 확장할 수 있는 기반을 마련합니다.

## 주요 기능

1. **차량 탐색:** 현대자동차·제네시스 차량 카드, 시작 가격, 공식 모델 페이지 링크 표시
2. **동력원 필터:** 전체 차량 / 전기차만 / 전기차 제외 선택 (현재 차량 카드 목록에 적용)\n3. **연령대별 추천:** 연령대 탭을 선택하면 해당 추천 차량 목록 표시
4. **상담 신청:** 성함, 연락처, 상담 유형을 입력하고 개인정보 이용에 동의하여 신청
5. **추가 선택 입력:** 관심 차종(자유 입력), 희망 구매금액 구간, 연령대(20대부터), 지역, 자유 문의 내용
6. **상담 데이터 저장:** Supabase REST API를 통해 상담 내용을 PostgreSQL에 저장하고 성공·실패 상태 안내
7. **차량 이미지 갱신:** GitHub Actions에서 Python 스크립트를 실행해 차량 페이지 화면을 캡처하고 이미지 파일을 갱신

> **가격 안내:** 차량 카드 가격은 2026년 10월 제조사 홈페이지의 시작 가격을 참고한 표시값이며, 옵션·세금·보조금·가격 변경에 따라 실제 견적과 다를 수 있습니다. 신규 차종의 로컬 이미지는 GitHub Actions의 이미지 수집 작업이 성공하면 표시되며, 실패한 모델은 텍스트 안내가 표시됩니다.\n\n## 프로젝트 구조

```text
carsales/
├── index.html                          # 화면 구성과 상담 입력 폼
├── css/
│   └── style.css                       # 색상, 레이아웃, 반응형 디자인
├── js/
│   ├── app.js                          # 차량/연령대 선택, 입력 검증, 상담 신청 UI
│   └── database.js                     # Supabase 연결 설정 및 상담 저장 API 호출
├── scripts/
│   └── download_images.py              # 차량 공식 페이지 이미지 캡처
├── images/
│   └── *.jpg                           # 웹사이트에서 사용하는 차량 이미지
└── .github/
    └── workflows/
        └── download-vehicle-images.yml # 이미지 캡처 자동화
```

### 파일별 역할

| 파일 | 주요 역할 | 실행 시점 |
| --- | --- | --- |
| `index.html` | 웹사이트의 HTML 구조와 입력 필드 정의 | 페이지 로드 |
| `css/style.css` | PC·모바일 디자인 및 입력 폼 스타일 | 페이지 로드 |
| `js/app.js` | 차량/상담 유형 선택, 폼 검증, 저장 결과 표시 | 페이지 로드 및 사용자 조작 |
| `js/database.js` | 공개용 Supabase 키로 REST API에 상담 요청 전송 | 상담 신청 시 |
| `scripts/download_images.py` | Playwright로 차량 페이지 캡처 후 `images/`에 JPG 저장 | GitHub Actions 실행 시 |
| `.github/workflows/download-vehicle-images.yml` | Python·브라우저 환경 준비, 이미지 캡처 실행, 변경 이미지 커밋 | 수동 실행 또는 관련 파일 변경 시 |

## 데이터 흐름

```text
방문자 브라우저
  ├─ index.html + css/style.css → 화면 표시
  ├─ images/*.jpg              → 차량 사진 표시
  └─ js/app.js                 → 상담 입력·검증
          │
          ▼
     js/database.js
          │ HTTPS POST
          ▼
 Supabase REST API
          │
          ▼
 PostgreSQL: public.consultation_requests
```

**중요:** GitHub에는 웹사이트 **소스 코드와 이미지**가 저장됩니다. 실제 고객 상담 정보는 GitHub가 아닌 **Supabase 데이터베이스**에 저장됩니다.

## 데이터베이스 구조

Supabase 프로젝트: [Table Editor](https://supabase.com/dashboard/project/xzxyxureqyroyuijjdnw/editor)

테이블: `public.consultation_requests`

| 컬럼 | 의미 | 입력 여부 |
| --- | --- | --- |
| `id` | 신청 식별자(UUID) | 자동 생성 |
| `created_at` | 접수 시간(서버 기준, 타임존 포함) | 자동 생성 |
| `name` | 성명 | 필수 |
| `phone` | 전화번호 | 필수 |
| `consultation_type` | 선택한 상담 유형 | 필수 |
| `interested_model` | 관심 차종 | 선택 |
| `budget_range` | 희망 구매금액 구간 | 선택 |
| `age_group` | 연령대 | 선택 |
| `region` | 지역(시·도) | 선택 |
| `message` | 자유 문의 내용 | 선택 |
| `consent_given` | 개인정보 이용 동의 여부 | 필수 |
| `status` | 상담 처리 상태(`new`, `in_progress`, `completed`) | 기본값 `new` |

선택 입력을 비워두면 해당 컬럼은 `NULL`로 저장됩니다. 기존 데이터는 신규 선택 항목이 비어 있어도 유지됩니다.

### 저장 처리

1. 방문자가 상담 폼을 작성하고 동의 체크박스를 선택합니다.
2. `js/app.js`가 필수 항목을 확인하고 입력값을 정리합니다.
3. `js/database.js`의 `submitConsultation(payload)`가 Supabase REST API로 `POST` 요청을 보냅니다.
4. 서버 저장이 성공하면 접수 완료 안내를 표시합니다. 실패하면 오류를 안내하며 입력 내용은 유지합니다.

## 실행 방법

별도 빌드 단계나 프레임워크가 없는 **정적 HTML/CSS/JavaScript 프로젝트**입니다.

- 저장소를 내려받고 정적 웹 서버로 프로젝트 루트를 제공하면 됩니다.
- 예: Python이 설치되어 있다면 프로젝트 루트에서 `python -m http.server 8000` 실행 후 `http://localhost:8000` 접속
- GitHub Pages를 사용하려면 저장소의 **Settings → Pages**에서 배포 소스를 설정해야 합니다. 배포가 설정되지 않았다면 GitHub Pages 주소는 열리지 않을 수 있습니다.

## 차량 이미지 갱신

GitHub 저장소의 **Actions → Capture official Hyundai model pages → Run workflow**에서 수동 실행할 수 있습니다. 워크플로 또는 이미지 캡처 스크립트가 변경될 때도 자동 실행되도록 설정되어 있습니다.

이 과정은 `scripts/download_images.py`를 실행하여 차량 페이지 화면을 캡처하고 `images/*.jpg`를 갱신합니다. 외부 사이트의 구조나 접속 정책이 변경되면 일부 캡처가 실패할 수 있습니다. 이미지 사용 권한과 출처 표기도 실제 공개 운영 전 확인해야 합니다.

## 보안 및 개인정보

- `js/database.js`에 포함된 키는 **브라우저 공개용(publishable) 키**입니다. DB 비밀번호 또는 관리자용 `service_role` 키를 GitHub에 올리면 안 됩니다.
- `consultation_requests` 테이블에는 **Row Level Security(RLS)**가 활성화되어 있으며, 공개 사용자는 상담 **등록(INSERT)**만 가능하도록 설정했습니다. 다른 방문자의 상담 조회·수정·삭제는 허용하지 않습니다.
- 관리자용 데이터 조회는 Supabase Dashboard 등 권한이 있는 환경에서 수행합니다.
- 실제 운영 전 개인정보 처리방침, 수집 목적, 보유 기간, 삭제 요청 절차, 운영자 연락처를 명확히 안내해야 합니다.
- 공개 입력 폼의 악용을 줄이기 위한 CAPTCHA·속도 제한 등 추가 보호가 필요할 수 있습니다.

## 향후 개선 아이디어

- **익명 클릭 분석:** 차량 카드, 연령대 탭, 상담 버튼 클릭 횟수를 별도 테이블에 집계
- **상담 관리 화면:** 관리자 인증을 거쳐 접수 목록·상담 상태를 확인하는 화면
- **운영 안정성:** 스팸 방지, 개인정보 보관·삭제 자동화, 오류 모니터링

현재 익명 클릭 분석과 별도 관리자 페이지는 **아직 구현되지 않았습니다**.
