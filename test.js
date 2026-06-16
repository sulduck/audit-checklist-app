const assert = require('node:assert/strict');
const {
  DEFAULT_CATEGORY,
  DEFAULT_PRIORITY,
  normalizeItem,
  filterItems,
  toggleItemCompletion,
  deleteChecklistItem,
  calculateStats,
} = require('./script');

const sampleItems = [
  { id: '1', text: '계약서 원본 확인', category: '계약', priority: '높음', completed: false },
  { id: '2', text: '예산 집행 증빙 확인', category: '예산', priority: '보통', completed: true },
  { id: '3', text: '계정 권한 검토', category: '보안', priority: '낮음', completed: false },
];

const tests = [
  {
    name: '검색어가 포함된 항목만 반환된다',
    run() {
      assert.deepEqual(filterItems(sampleItems, '계약').map((item) => item.id), ['1']);
    },
  },
  {
    name: '검색어를 비우면 전체 항목이 반환된다',
    run() {
      assert.deepEqual(filterItems(sampleItems, ''), sampleItems);
      assert.deepEqual(filterItems(sampleItems, '   '), sampleItems);
    },
  },
  {
    name: '검색 결과가 없으면 빈 배열이 반환된다',
    run() {
      assert.deepEqual(filterItems(sampleItems, '존재하지않음'), []);
    },
  },
  {
    name: '완료 처리 후 완료 상태가 바뀐다',
    run() {
      const toggledItems = toggleItemCompletion(sampleItems, '1');
      assert.equal(toggledItems.find((item) => item.id === '1').completed, true);
      assert.equal(sampleItems.find((item) => item.id === '1').completed, false);
    },
  },
  {
    name: '삭제 후 항목 개수가 줄어든다',
    run() {
      const remainingItems = deleteChecklistItem(sampleItems, '2');
      assert.equal(remainingItems.length, 2);
      assert.equal(remainingItems.some((item) => item.id === '2'), false);
    },
  },
  {
    name: '전체 항목 수와 완료 항목 수가 정확히 계산된다',
    run() {
      assert.deepEqual(calculateStats(sampleItems), { total: 3, completed: 1 });
    },
  },
  {
    name: '기존 데이터에 분야가 없으면 기타가 적용된다',
    run() {
      assert.equal(normalizeItem({ id: '4', text: '분야 없음', priority: '높음' }).category, DEFAULT_CATEGORY);
    },
  },
  {
    name: '기존 데이터에 우선순위가 없으면 보통이 적용된다',
    run() {
      assert.equal(normalizeItem({ id: '5', text: '우선순위 없음', category: '복무' }).priority, DEFAULT_PRIORITY);
    },
  },
];

let passed = 0;

for (const test of tests) {
  try {
    test.run();
    passed += 1;
    console.log(`✓ ${test.name}`);
  } catch (error) {
    console.error(`✗ ${test.name}`);
    throw error;
  }
}

console.log(`${passed}/${tests.length} tests passed`);
