'use strict';

let nextId = 3;

const comments = [
  {
    id: 1,
    taskId: 1,
    author: 'minsu',
    body: '환경 설정 섹션은 제가 이번 주에 업데이트할게요.',
    createdAt: '2026-08-22T04:10:00.000Z'
  },
  {
    id: 2,
    taskId: 3,
    author: 'jiyoung',
    body: '재현 로그를 이슈에 첨부해 주세요.',
    createdAt: '2026-08-26T01:45:00.000Z'
  }
];

function listByTask(taskId) {
  return comments.filter((comment) => comment.taskId === taskId);
}

function addComment({ taskId, author, body }) {
  const comment = {
    id: nextId++,
    taskId,
    author,
    body,
    createdAt: new Date().toISOString()
  };
  comments.push(comment);
  return comment;
}

function deleteComment(id) {
  const index = comments.findIndex((comment) => comment.id === id);
  if (index === -1) return false;
  comments.splice(index, 1);
  return true;
}

module.exports = { listByTask, addComment, deleteComment };
