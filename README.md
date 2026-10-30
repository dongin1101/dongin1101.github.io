# HR Notebook

## GitHub Pages 배포

현재 디자인과 예시 기록을 그대로 배포합니다. 개인 로컬 폴더의 기록은 포함하지 않습니다. 방문자는 예시 기록을 바로 열람할 수 있습니다. 실제 공개 콘텐츠 추가는 추후 진행합니다.

GitHub 저장소에 업로드한 뒤 Settings → Pages → Build and deployment → Source에서 GitHub Actions를 선택합니다. `.github/workflows/pages.yml`이 `dist` 폴더를 배포합니다. `main` 브랜치의 사이트 파일을 수정하면 같은 주소로 자동 갱신됩니다. 첫 배포는 Actions → Publish HR Notebook → Run workflow로 실행할 수도 있습니다.

기존 Sites 배포 정보는 `.openai/hosting.json`에 보존합니다. GitHub Pages는 해당 파일을 사용하지 않습니다. 자동 배포 범위는 GitHub Pages이며 Sites 배포는 별도입니다.

정적 사이트 소스는 dist 폴더에 있습니다. index.html을 열어 사용할 수도 있습니다. 직접 폴더 연결은 HTTPS 사이트 또는 localhost에서 Chrome/Edge 데스크톱으로 사용하세요.

실제 기록은 사이트 소스 밖의 `나의 아카이브` 폴더에 관리합니다. 사이트 배포에 개인 기록이 포함되지 않습니다. 폴더 연결 후 사이트는 파일을 브라우저 안에서 읽고, 새 기록을 해당 로컬 폴더에 저장합니다. 자동 동기화나 서버 백업은 제공하지 않습니다. 폴더를 별도로 백업하세요.

파일 형식은 UTF-8 Markdown이며 상단 메타데이터는 title, category, date, tags(쉼표 구분), url입니다. 분류값은 HR 포트폴리오 / 독서 / 뉴스 / 관심사입니다. 파일명은 날짜-제목.md입니다.
