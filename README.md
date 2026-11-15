# 강동인 · HR Notebook

공개 사이트: https://dongin1101.github.io/

## 페이지 구성

- `/`: 사이트 소개와 세 섹션의 최신 글
- `/reading/`: 독서 아카이브
- `/hrnews/`: HR 뉴스 아카이브
- `/interest/`: 관심사 아카이브
- 기존 업무 경험 주소는 홈으로 이동합니다.

## 콘텐츠와 배포

`dist/published.js`가 공개 기록 원본입니다. 노션 링크로 받은 공개용 글을 이 파일에 반영하고, `node build-pages.cjs`로 각 경로의 정적 HTML을 생성합니다. GitHub Actions도 배포 전에 같은 생성기를 실행합니다. `dist/index.html`이 공통 화면 원본이며 하위 폴더의 HTML은 자동 생성 결과입니다.

공개 전 로컬 확인: `node build-pages.cjs` 실행 후 `python -m http.server 8765 --directory dist`.

개인 아카이브 원본은 저장소 밖의 ‘나의 아카이브’ 폴더에서 보관합니다. GitHub Pages에는 `dist`만 배포됩니다. 기존 Sites 식별자는 `.openai/hosting.json`에 보존하며 GitHub Pages 배포에는 사용하지 않습니다.

