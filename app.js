$(function() {
  // Helper: show messages (simple)
  function showError(msg) { alert(msg); }

  // Toggle forms
  $('#showRegister').click(() => { $('#loginForm').hide(); $('#registerForm').show(); });
  $('#showLogin').click(() => { $('#registerForm').hide(); $('#loginForm').show(); });

  // Check session on load
  $.get('/auth/me').done((res) => {
    if (res.loggedIn) {
      onLogin(res.user);
    } else {
      onLogout();
    }
  });

  // Register
  $('#registerForm').submit(function (e) {
    e.preventDefault();
    const email = $('#regEmail').val().trim();
    const password = $('#regPassword').val().trim();
    $.post('/auth/register', { email, password })
      .done((res) => onLogin(res.user))
      .fail((xhr) => showError(xhr.responseJSON?.error || 'Register failed'));
  });

  // Login
  $('#loginForm').submit(function (e) {
    e.preventDefault();
    const email = $('#loginEmail').val().trim();
    const password = $('#loginPassword').val().trim();
    $.post('/auth/login', { email, password })
      .done((res) => onLogin(res.user))
      .fail((xhr) => showError(xhr.responseJSON?.error || 'Login failed'));
  });

  // Logout
  $('#logoutBtn').click(function() {
    $.post('/auth/logout').done(() => onLogout()).fail(() => showError('Logout failed'));
  });

  // When logged in: show todo area
  function onLogin(user) {
    $('#loginForm, #registerForm').hide();
    $('#loggedInBar').show();
    $('#userEmailDisplay').text(user.email || '');
    $('#todoSection').show();
    loadTodos();
  }

  function onLogout() {
    $('#registerForm, #loginForm').show();
    $('#loggedInBar').hide();
    $('#todoSection').hide();
    $('#todoList').empty();
  }

  // Load todos
  function loadTodos() {
    $.get('/api/todos')
      .done((res) => {
        renderTodos(res.todos || []);
      })
      .fail((xhr) => {
        if (xhr.status === 401) onLogout();
        else showError('Could not load todos');
      });
  }

  // Add todo
  $('#addTodoForm').submit(function(e) {
    e.preventDefault();
    const text = $('#todoInput').val().trim();
    if (!text) return;
    $.ajax({
      url: '/api/todos',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ text })
    }).done((res) => {
      $('#todoInput').val('');
      loadTodos();
    }).fail((xhr) => {
      showError(xhr.responseJSON?.error || 'Add todo failed');
    });
  });

  // Render list
  function renderTodos(todos) {
    const $list = $('#todoList').empty();
    if (!todos.length) {
      $list.append('<li>No todos yet</li>');
      return;
    }
    todos.forEach(t => {
      const $li = $(`
        <li data-id="${t._id}">
          <span class="todoText ${t.completed ? 'completed' : ''}"></span>
          <div class="todoActions">
            <button class="toggleBtn">${t.completed ? 'Uncheck' : 'Complete'}</button>
            <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</button>
          </div>
        </li>
      `);
      $li.find('.todoText').text(t.text);
      $li.find('.toggleBtn').click(() => toggleComplete(t._id, !t.completed));
      $li.find('.editBtn').click(() => editTodo(t._id, t.text));
      $li.find('.deleteBtn').click(() => deleteTodo(t._1d = t._id));
      $list.append($li);
    });
  }

  // Toggle completed
  function toggleComplete(id, completed) {
    $.ajax({
      url: '/api/todos/' + id,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ completed })
    }).done(loadTodos)
      .fail((xhr) => showError(xhr.responseJSON?.error || 'Update failed'));
  }

  // Edit
  function editTodo(id, currentText) {
    const newText = prompt('Edit todo', currentText);
    if (newText === null) return; // cancelled
    $.ajax({
      url: '/api/todos/' + id,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ text: newText })
    }).done(loadTodos)
      .fail((xhr) => showError(xhr.responseJSON?.error || 'Update failed'));
  }

  // Delete
  function deleteTodo(id) {
    if (!confirm('Delete this todo?')) return;
    $.ajax({
      url: '/api/todos/' + id,
      type: 'DELETE'
    }).done(loadTodos)
      .fail((xhr) => showError(xhr.responseJSON?.error || 'Delete failed'));
  }
});
