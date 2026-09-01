'use strict';

const users = [
  { username: 'jiyoung', name: '김지영', role: 'PM', email: 'jiyoung@taskflow.local' },
  { username: 'minsu', name: '박민수', role: 'Backend', email: 'minsu@taskflow.local' },
  { username: 'haeun', name: '이하은', role: 'Frontend', email: 'haeun@taskflow.local' },
  { username: 'dohyun', name: '정도현', role: 'QA', email: 'dohyun@taskflow.local' }
];

function listUsers() {
  return users;
}

function getUser(username) {
  return users.find((user) => user.username === username) || null;
}

module.exports = { listUsers, getUser };
