# 우리 연구실 홈페이지

## 📖 소개

이것은 연구실의 공식 홈페이지입니다. 연구실의 정보, 팀, 연구 프로젝트, 논문, 뉴스 등을 소개합니다.

## 🌐 페이지 구조

- **index.html** - 홈페이지
- **research.html** - 연구 프로젝트 소개
- **people.html** - 팀 멤버 소개
- **publications.html** - 논문 및 발표 자료
- **news.html** - 최근 소식
- **contact.html** - 연락처 및 문의 양식

## 📁 폴더 구조

```
lab-website/
├── index.html              # 홈페이지
├── research.html           # 연구 페이지
├── people.html             # 팀 페이지
├── publications.html       # 논문 페이지
├── news.html               # 뉴스 페이지
├── contact.html            # 연락처 페이지
├── css/
│   └── style.css           # 메인 스타일시트
├── images/                 # 이미지 폴더
│   ├── lab-main.jpg        # 메인 배너 이미지
│   ├── professor.jpg       # 교수 사진
│   └── members/            # 팀 멤버 이미지
└── README.md               # 이 파일
```

## 🎨 기능

- ✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)
- ✅ 현대적이고 전문적인 디자인
- ✅ 쉬운 네비게이션
- ✅ 동적인 호버 효과
- ✅ 문의 양식
- ✅ 검색 엔진 최적화 (SEO)

## 🚀 시작하기

### 필수 요구사항
- 웹 브라우저 (Chrome, Firefox, Safari, Edge 등)
- 텍스트 에디터 (VS Code, Sublime Text 등)

### 설치 및 실행

1. 저장소 클론
```bash
git clone https://github.com/sungyear128-rgb/lab-website.git
```

2. 폴더로 이동
```bash
cd lab-website
```

3. index.html을 웹 브라우저로 열기
   - 또는 로컬 서버 실행
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   그 후 `http://localhost:8000` 접속

## 📝 커스터마이징

### 텍스트 수정
- 각 HTML 파일을 텍스트 에디터로 열어 내용을 수정할 수 있습니다.

### 색상 변경
- `css/style.css` 파일에서 색상 코드를 변경합니다.
- 주요 색상: `#667eea` (파란색), `#764ba2` (보라색)

### 이미지 추가
- `images/` 폴더에 이미지를 추가하고 HTML 파일에서 참조합니다.

## 🌍 배포

### GitHub Pages를 통한 무료 배포

1. GitHub 저장소 설정 가기
2. Settings → Pages
3. Source: "Deploy from a branch" 선택
4. Branch: "main" 선택
5. Save 클릭

홈페이지가 자동으로 배포됩니다: `https://sungyear128-rgb.github.io/lab-website`

## 🔧 기술 스택

- **HTML5** - 마크업
- **CSS3** - 스타일링 (플렉스박스, 그리드)
- **JavaScript** - 상호작용 (추가 예정)

## 📧 연락처

연락처 페이지를 통해 문의할 수 있습니다: `contact.html`

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 🙏 기여

버그 리포트나 개선 사항이 있으시면 이슈를 등록해주세요.

---

**마지막 업데이트**: 2024년 8월 26일
