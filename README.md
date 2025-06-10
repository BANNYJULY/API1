# 문화 정보 통합 웹 서비스

## 프로젝트 소개
이 프로젝트는 KOPIS(공연예술통합전산망) API와 문화 API를 활용하여 다양한 문화 정보를 제공하는 웹 서비스입니다. 사용자들에게 공연 정보와 문화 컨텐츠를 쉽게 접근할 수 있도록 구현되었습니다.

## 주요 기능
- 공연 정보 검색 및 조회
- 문화 컨텐츠 정보 제공
- 부산 문화 정보 블로그 연동
- 반응형 웹 디자인 적용

## 기술 스택
- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
- API:
  - KOPIS API (공연예술통합전산망)
  - 문화 정보 API

## 프로젝트 구조
```
├── index.html         # 메인 페이지
├── style.css         # 스타일시트
├── script.js         # 메인 JavaScript
├── kopis_api.js      # KOPIS API 관련 기능
├── culture_api.js    # 문화 API 관련 기능
├── color.txt         # 색상 정보
├── images/           # 이미지 리소스
└── busan_culture_blog.html  # 부산 문화 블로그 페이지
```

## 설치 및 실행 방법
1. 저장소 클론
```bash
git clone [repository URL]
```

2. 프로젝트 폴더로 이동
```bash
cd [project folder]
```

3. 웹 브라우저에서 index.html 실행

## API 키 설정
- KOPIS API와 문화 API를 사용하기 위해서는 각각의 API 키가 필요합니다.
- API 키는 보안을 위해 별도로 관리되어야 합니다.

## 주의사항
- API 키는 반드시 안전하게 관리해야 합니다.
- API 호출 시 일일 제한 횟수를 확인하시기 바랍니다.

## 라이선스
이 프로젝트는 MIT 라이선스 하에 있습니다.