document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskTable = document.getElementById('taskTable');
    let editIndex = null;

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        renderTasks(tasks);
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(tasks) {
        taskTable.innerHTML = `
            <tr>
                <th>#</th>
                <th>Task</th>
                <th>Done</th>
                <th>Actions</th>
            </tr>
        `;
        tasks.forEach((task, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${task.text}</td>
                <td><input type='checkbox' ${task.done ? 'checked' : ''} class='toggle-done' data-index='${index}'></td>
                <td>
                    <button class='edit' data-index='${index}'>Edit</button>
                    <button class='delete' data-index='${index}'>Delete</button>
                </td>
            `;
            taskTable.appendChild(row);
        });
        addEventListeners();
    }

    function addEventListeners() {
        document.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (confirm('Are you sure you want to delete this task?')) {
                    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                    tasks.splice(e.target.dataset.index, 1);
                    saveTasks(tasks);
                    renderTasks(tasks);
                }
            });
        });
        document.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                taskInput.value = tasks[e.target.dataset.index].text;
                editIndex = e.target.dataset.index;
                addTaskBtn.textContent = "Update Task";
            });
        });
        document.querySelectorAll('.toggle-done').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                tasks[e.target.dataset.index].done = e.target.checked;
                saveTasks(tasks);
                renderTasks(tasks);
            });
        });
    }

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            if (editIndex !== null) {
                tasks[editIndex].text = taskText;
                editIndex = null;
                addTaskBtn.textContent = "Add Task";
            } else {
                tasks.push({ text: taskText, done: false });
            }
            saveTasks(tasks);
            renderTasks(tasks);
            taskInput.value = '';
        }
    });

    loadTasks();
});
