# TaskFlow API

모든 응답은 JSON이며, 에러는 `{ "error": "<메시지>" }` 형태입니다.

## 작업 (Tasks)

| Method | Path             | 설명                                       |
| ------ | ---------------- | ------------------------------------------ |
| GET    | `/api/tasks`     | 목록 조회. `status`, `q` 쿼리 지원         |
| GET    | `/api/tasks/:id` | 단건 조회                                  |
| POST   | `/api/tasks`     | 생성. `title` 필수, `description`/`assignee` 선택 |
| PATCH  | `/api/tasks/:id` | 부분 수정 (제목/설명/담당자/상태)          |
| DELETE | `/api/tasks/:id` | 삭제                                       |

상태 값: `todo`, `in_progress`, `done`

## 프로젝트 (Projects)

| Method | Path                              | 설명                             |
| ------ | --------------------------------- | -------------------------------- |
| GET    | `/api/projects`                   | 목록 조회 (`taskCount` 포함)     |
| POST   | `/api/projects`                   | 생성. `name` 필수                |
| GET    | `/api/projects/:id`               | 상세 조회 (배정된 작업 포함)     |
| PATCH  | `/api/projects/:id`               | 이름/설명 수정                   |
| DELETE | `/api/projects/:id`               | 삭제                             |
| POST   | `/api/projects/:id/tasks`         | 작업 배정. body: `{ taskId }`    |
| DELETE | `/api/projects/:id/tasks/:taskId` | 작업 배정 해제                   |

## 댓글 (Comments)

| Method | Path                                     | 설명                                  |
| ------ | ---------------------------------------- | ------------------------------------- |
| GET    | `/api/tasks/:taskId/comments`            | 작업의 댓글 목록                      |
| POST   | `/api/tasks/:taskId/comments`            | 작성. `body` 필수, `author`는 등록 사용자만 |
| DELETE | `/api/tasks/:taskId/comments/:commentId` | 삭제                                  |

## 태그 (Tags)

| Method | Path                      | 설명                                        |
| ------ | ------------------------- | ------------------------------------------- |
| GET    | `/api/tasks/:taskId/tags` | 작업의 태그 목록                            |
| PUT    | `/api/tasks/:taskId/tags` | 태그 전체 교체. body: `{ tags: string[] }`  |
| GET    | `/api/tags`               | 전체 태그 목록 (중복 제거, 정렬)            |

## 사용자 / 활동 / 통계

| Method | Path                   | 설명                                     |
| ------ | ---------------------- | ---------------------------------------- |
| GET    | `/api/users`           | 팀 사용자 디렉터리                       |
| GET    | `/api/users/:username` | 사용자 단건 조회                         |
| GET    | `/api/activity`        | 최근 활동 로그. `limit` 쿼리 (기본 20)   |
| GET    | `/api/stats`           | 상태별/담당자별 집계와 완료율            |
| GET    | `/api/health`          | 헬스 체크                                |
