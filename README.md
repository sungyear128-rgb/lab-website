# Hallym Clinical Neuropsychology Website

한림대학교 일반대학원 임상신경심리전공용 GitHub Pages + Pages CMS 홈페이지입니다.

## 사이트 구조

- `index.html` — Home
- `research.html` — Research
- `professor.html` — Professor
- `program.html` — Program & Training
- `publications.html` — Publications
- `people.html` — People
- `news.html` — News
- `resources.html` — Resources / 파일 자료실
- `contact.html` — Contact & Directions
- `data/` — 관리자 화면에서 수정하는 실제 콘텐츠
- `assets/images/` — 이미지
- `assets/docs/` — PDF/문서 업로드 폴더
- `.pages.yml` — Pages CMS 관리자 설정

## GitHub에 올리는 방법

현재 `lab-website` 저장소의 파일을 이 폴더의 내용으로 교체합니다.
중요: ZIP 파일 자체를 올리는 것이 아니라 ZIP을 푼 뒤 **안의 파일과 폴더 전체**를 저장소 루트에 올려야 합니다.

GitHub Pages:
1. Settings
2. Pages
3. Source: Deploy from a branch
4. Branch: `main`
5. Folder: `/(root)`
6. Save

## Pages CMS 연결

1. https://app.pagescms.org 접속
2. GitHub로 로그인
3. Pages CMS GitHub App 설치
4. `sungyear128-rgb/lab-website` 저장소 선택
5. 저장소 루트의 `.pages.yml`을 자동으로 읽으면 관리자 메뉴가 나타납니다.

관리자 화면에서 수정 가능한 항목:
- 연구실 기본 정보
- 교수님 프로필 및 사진
- 연구 분야
- 연구 과제
- 구성원 및 사진
- 논문
- 연구실 소식 및 이미지
- 자료실 PDF/문서 업로드

저장하면 Pages CMS가 GitHub 저장소의 JSON/미디어 파일을 수정합니다.
GitHub Pages 배포 후 홈페이지에 자동 반영됩니다.

## 중요한 점

HTML/CSS 코드는 디자인입니다.
평소 운영할 때는 HTML 코드를 수정하지 말고 Pages CMS에서 `data/*.json`과 이미지만 수정하면 됩니다.

## 사진 및 파일

- 사진: `assets/images`
- PDF/문서: `assets/docs`

Pages CMS에서 업로드하면 지정 폴더에 저장됩니다.


## Program & Training (v2 추가)

2025 대학원 설명회 내용을 기반으로 아래 항목을 추가했습니다.

- 임상신경심리학 / 신경심리학 소개
- 신경심리평가 영역과 활용
- 신경심리학적 개입·치료, 연구, 교육·수련감독
- 전공 교과목 전체
- 임상현장실습
- Neuropsychology Case Conference
- 주 1회 Lab Meeting
- 국내외 학회
- 전공 적합 특성 및 대학원 전 추천 과목
- 졸업 후 수련 경로 및 진출 분야
- Research 페이지의 구체적 연구 주제·예시
- 대학원 상담 및 문의 안내

위 내용은 `data/program.json`, `roles.json`, `curriculum.json`, `training.json`,
`conferences.json`, `career.json`, `research_topics.json`에서 관리되며 Pages CMS에서 수정할 수 있습니다.
