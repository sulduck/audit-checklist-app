const STORAGE_KEY = 'auditChecklistItems';

const form = document.querySelector('#checklist-form');
const input = document.querySelector('#item-input');
const checklist = document.querySelector('#checklist');
const emptyState = document.querySelector('#empty-state');
const itemCount = document.querySelector('#item-count');
const formMessage = document.querySelector('#form-message');

let items = loadItems();

function loadItems() {
  const savedItems = localStorage.getItem(STORAGE_KEY);

  if (!savedItems) {
    return [];
  }

  try {
    const parsedItems = JSON.parse(savedItems);
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch {
    return [];
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function renderItems() {
  checklist.innerHTML = '';

  items.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.className = `checklist-item${item.completed ? ' completed' : ''}`;
    listItem.dataset.id = item.id;

    const itemText = document.createElement('span');
    itemText.className = 'item-text';
    itemText.textContent = item.text;

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
    listItem.append(itemText, actions);
    checklist.appendChild(listItem);
  });

  emptyState.hidden = items.length > 0;
  itemCount.textContent = `${items.length}건`;
}

function createItemId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function addItem(text) {
  items.unshift({
    id: createItemId(),
    text,
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

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    formMessage.textContent = '점검 항목을 입력해 주세요.';
    input.focus();
    return;
  }

  formMessage.textContent = '';
  addItem(text);
  form.reset();
  input.focus();
});

renderItems();
