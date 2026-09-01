# 기여 가이드

## 개발 환경

```bash
npm install
npm run dev     # 파일 변경 감지 재시작
npm test        # node --test 단위 테스트
```

## 브랜치와 커밋

- 브랜치: `feature/<이름>`, `fix/<이름>`, `refactor/<이름>`, `chore/<이름>`
- 커밋: Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`)
- PR은 관련 이슈를 `Closes #N` / `Fixes #N`으로 연결합니다.

## 코드 규칙

- CommonJS(`require`/`module.exports`), 세미콜론 사용, 2칸 들여쓰기
- 도메인 로직은 `src/*.js` 모듈에, HTTP 핸들러는 `src/server.js`와 `src/routes/`에 둡니다.
- 새 동작에는 가장 가까운 계층의 테스트를 `tests/*.spec.js`에 추가합니다.

## 리뷰 체크리스트

- [ ] `npm test` 통과
- [ ] API 변경 시 `docs/api.md` 갱신
- [ ] 사용자에게 보이는 변경 시 `CHANGELOG.md` 갱신
