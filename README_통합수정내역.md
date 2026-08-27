# 한림대학교 임상신경심리 홈페이지 — 통합 UI 수정팩

## 이번에 수정한 내용

### 1. 모든 페이지 상단 메뉴 통일
모든 페이지에서 아래 메뉴가 동일하게 표시됩니다.

Home / Research / Professor / Program / Publications / People / News / Resources / Contact

기존에는 Professor, Publications, People, News, Resources 페이지에서 Program이 빠져 있었습니다.

### 2. 모든 페이지 Footer 통일
Footer의 Explore 메뉴도 모든 페이지에서 동일하게 보이도록 맞췄습니다.
Program, News, Resources, Contact까지 추가했습니다.

### 3. 글자 배열과 세로 간격 정리
Research areas / Ongoing projects 등에서
제목은 왼쪽, 설명은 오른쪽으로 흩어져 있던 구조를

제목
설명
콘텐츠

순서의 한 세로축 구조로 통일했습니다.

### 4. 섹션 간 여백 통일
Home / Research / Program / Professor 등 페이지마다 달라 보이던 세로 간격을 통일했습니다.

### 5. 카드 높이와 내부 정렬 통일
Research 카드, Project 카드, News, Program 카드 등이 같은 줄에서 일정한 높이와 시작점을 갖도록 정리했습니다.

### 6. People / Resources 빈 상태 정렬
내용이 없는 경우 안내 상자가 왼쪽에 작게 붙지 않고 페이지 안에서 자연스럽게 중앙 정렬됩니다.

### 7. Home의 Lab News 한 개 표시 개선
소식이 하나뿐일 때 지나치게 넓은 빈 공간이 어색하지 않도록 카드 폭을 안정적으로 제한했습니다.

### 8. Contact 페이지 지도 기능 추가
작은 지도 위에 마우스를 올리면 '클릭하여 크게 보기'가 표시됩니다.

지도를 클릭하면:
- 전체 화면에 큰 지도 표시
- + 버튼: 확대
- − 버튼: 축소
- 100% 버튼: 초기화
- 마우스 휠: 확대/축소
- 확대된 상태에서 드래그: 지도 이동
- ESC 또는 X: 닫기

### 9. CMS 데이터는 변경하지 않음
data/*.json 및 .pages.yml은 건드리지 않습니다.
현재 Pages CMS에서 입력한 교수님, 연구, 교과목, 수련, 논문 등의 데이터는 그대로 유지됩니다.

## GitHub에 올릴 파일

이 ZIP 안의 파일과 폴더를 저장소 루트에 그대로 업로드하여 기존 파일을 덮어쓰세요.

- index.html
- research.html
- professor.html
- program.html
- publications.html
- people.html
- news.html
- resources.html
- contact.html
- assets/css/style.css
- assets/js/app.js

data 폴더와 .pages.yml은 교체하지 않아도 됩니다.
