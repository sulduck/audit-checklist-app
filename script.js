const STORAGE_KEY = 'auditChecklistItems';
const DEFAULT_CATEGORY = '기타';
const DEFAULT_PRIORITY = '보통';

const form = document.querySelector('#checklist-form');
const input = document.querySelector('#item-input');
const categorySelect = document.querySelector('#category-select');
const prioritySelect = document.querySelector('#priority-select');
const checklist = document.querySelector('#checklist');
const emptyState = document.querySelector('#empty-state');
const itemCount = document.querySelector('#item-count');
const totalCount = document.querySelector('#total-count');
const completedCount = document.querySelector('#completed-count');
const formMessage = document.querySelector('#form-message');
const searchInput = document.querySelector('#search-input');
const clearSearchButton = document.querySelector('#clear-search-button');
const searchMessage = document.querySelector('#search-message');

let items = loadItems();
let searchQuery = '';

function normalizeItem(item) {
  return {
    id: item.id || createItemId(),
    text: item.text || '',
    category: item.category || DEFAULT_CATEGORY,
    priority: item.priority || DEFAULT_PRIORITY,
    completed: Boolean(item.completed),
  };
}

function loadItems() {
  const savedItems = localStorage.getItem(STORAGE_KEY);

  if (!savedItems) {
    return [];
  }

  try {
    const parsedItems = JSON.parse(savedItems);
    return Array.isArray(parsedItems) ? parsedItems.map(normalizeItem) : [];
  } catch {
    return [];
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function createMeta(label, value, className) {
  const wrapper = document.createElement('span');
  wrapper.className = `meta-badge ${className}`;

  const srLabel = document.createElement('span');
  srLabel.className = 'sr-only';
  srLabel.textContent = `${label}: `;

  wrapper.append(srLabel, document.createTextNode(value));
  return wrapper;
}

function getItemStatusLabel(item) {
  return item.completed ? '완료' : '진행 중';
}

function getFilteredItems() {
  const query = searchQuery.trim().toLowerCase();

  if (!query) {
    return items;
  }

  return items.filter((item) => (
    item.text.toLowerCase().includes(query)
    || item.category.toLowerCase().includes(query)
    || item.priority.toLowerCase().includes(query)
    || getItemStatusLabel(item).toLowerCase().includes(query)
  ));
}

function renderItems() {
  checklist.innerHTML = '';

  const filteredItems = getFilteredItems();

  filteredItems.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.className = `checklist-item${item.completed ? ' completed' : ''}`;
    listItem.dataset.id = item.id;

    const itemText = document.createElement('span');
    itemText.className = 'item-text';
    itemText.textContent = item.text;

    const category = createMeta('분야', item.category, 'category-badge');
    const priority = createMeta('우선순위', item.priority, `priority-badge priority-${item.priority}`);
    const status = createMeta('완료 여부', getItemStatusLabel(item), 'status-badge');

    const actions = document.createElement('div');
    actions.className = 'item-actions';

    const completeButton = document.createElement('button');
    completeButton.type = 'button';
    completeButton.className = 'complete-button';
    completeButton.textContent = item.completed ? '완료 취소' : '완료';
    completeButton.addEventListener('click', () => toggleItem(item.id));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '삭제';
    deleteButton.addEventListener('click', () => deleteItem(item.id));

    actions.append(completeButton, deleteButton);
    listItem.append(itemText, category, priority, status, actions);
    checklist.appendChild(listItem);
  });

  const completedItems = items.filter((item) => item.completed).length;
  const hasSearchQuery = searchQuery.trim().length > 0;

  emptyState.hidden = hasSearchQuery ? filteredItems.length > 0 : items.length > 0;
  emptyState.textContent = hasSearchQuery
    ? '검색 조건에 맞는 점검 항목이 없습니다.'
    : '등록된 점검 항목이 없습니다. 새 항목을 추가해 주세요.';
  itemCount.textContent = hasSearchQuery
    ? `${filteredItems.length} / ${items.length}건`
    : `${items.length}건`;
  totalCount.textContent = `${items.length}건`;
  completedCount.textContent = `${completedItems}건`;
  searchMessage.textContent = hasSearchQuery
    ? `검색 결과 ${filteredItems.length}건이 표시됩니다.`
    : '';
  clearSearchButton.hidden = !hasSearchQuery;
}

function createItemId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function addItem(text, category, priority) {
  items.unshift({
    id: createItemId(),
    text,
    category,
    priority,
    completed: false,
  });
  saveItems();
  renderItems();
}

function toggleItem(id) {
  items = items.map((item) => (
    item.id === id ? { ...item, completed: !item.completed } : item
  ));
  saveItems();
  renderItems();
}

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  saveItems();
  renderItems();
}

searchInput.addEventListener('input', (event) => {
  searchQuery = event.target.value;
  renderItems();
});

clearSearchButton.addEventListener('click', () => {
  searchQuery = '';
  searchInput.value = '';
  renderItems();
  searchInput.focus();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();
  const category = categorySelect.value;
  const priority = prioritySelect.value;

  if (!text) {
    formMessage.textContent = '점검 항목을 입력해 주세요.';
    input.focus();
    return;
  }

  formMessage.textContent = '';
  addItem(text, category, priority);
  form.reset();
  prioritySelect.value = DEFAULT_PRIORITY;
  input.focus();
});

renderItems();
