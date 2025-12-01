// ensure logged in
(async function(){
  const status = await fetch('/auth/status').then(r=>r.json());
  if(!status.loggedIn) { window.location.href = '/index.html'; return; }
  loadTodos();
})();

const todoList = document.getElementById('todoList');
const addForm = document.getElementById('addTodoForm');
const todoText = document.getElementById('todoText');
const statusBox = document.getElementById('status');
const logoutBtn = document.getElementById('logoutBtn');

async function loadTodos(){
  todoList.innerHTML = '';
  statusBox.textContent = 'Loading...';
  const res = await fetch('/todos');
  const data = await res.json();
  statusBox.textContent = '';
  if(!data.success) { statusBox.textContent = 'Could not load tasks'; return; }
  data.todos.forEach(t=>{
    const li = document.createElement('li');
    li.dataset.id = t._id;
    li.className = t.done ? 'done' : '';
    li.innerHTML = `<span>${escapeHtml(t.text)}</span>
      <div class="todo-buttons">
        <button class="toggle">${t.done ? 'Undo' : 'Done'}</button>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>`;
    todoList.appendChild(li);
  });
}

addForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const text = todoText.value.trim();
  if(!text) return;
  await fetch('/todos', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text }) });
  todoText.value='';
  loadTodos();
});

todoList.addEventListener('click', async (e)=>{
  const li = e.target.closest('li');
  if(!li) return;
  const id = li.dataset.id;

  if(e.target.classList.contains('delete')){
    await fetch(`/todos/${id}`, { method:'DELETE' });
    return loadTodos();
  }
  if(e.target.classList.contains('toggle')){
    const isDone = li.classList.contains('done');
    await fetch(`/todos/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ done: !isDone }) });
    return loadTodos();
  }
  if(e.target.classList.contains('edit')){
    const old = li.querySelector('span').innerText;
    const newText = prompt('Edit task:', old);
    if(!newText) return;
    await fetch(`/todos/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text: newText }) });
    return loadTodos();
  }
});

logoutBtn && logoutBtn.addEventListener('click', async ()=>{
  await fetch('/auth/logout', { method:'POST' });
  window.location.href = '/index.html';
});

// helper
function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[s])); }