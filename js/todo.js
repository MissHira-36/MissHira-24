document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.querySelector('#taskInput');
    const addTaskBtn = document.querySelector('#addTaskBtn');
    const taskList = document.querySelector('#taskList');
    const confirmModal = document.querySelector('#confirmModal');
    const confirmDeleteBtn = document.querySelector('#confirmDelete');
    const cancelDeleteBtn = document.querySelector('#cancelDelete');

    let taskToDelete = null;

    // Load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => createTask(task.text, null, false, task.completed));
    }

    // Save tasks to local storage
    function saveTasks() {
        const tasks = []; // Initialize an empty array
        document.querySelectorAll('.todo-item').forEach(li => { // Select all to-do items
            const taskSpan = li.querySelector('span');
            const checkBox = li.querySelector('.task-checkbox');
            tasks.push({
                text: taskSpan.textContent,
                completed: checkBox.checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Save array to local storage
    }

    // Function to create and display a task
    function createTask(taskText, insertAfterElement = null, isNew = true, isCompleted = false) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        const taskSpan = document.createElement('span'); // Create a span element for the task text
        taskSpan.textContent = taskText;
        taskSpan.style.textDecoration = isCompleted ? 'line-through' : 'none'; // Set initial text decoration
        li.appendChild(taskSpan);

        // Edit task input field
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';
        editInput.style.display = 'none';
        li.appendChild(editInput);

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'task-btn';

        // Update button after task editing
        const updateBtn = document.createElement('button');
        updateBtn.textContent = 'Update';
        updateBtn.className = 'task-btn';
        updateBtn.style.display = 'none';

        // Delete button to delete task
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'task-btn';

        // Move Up button
        const moveUpBtn = document.createElement('button');
        moveUpBtn.textContent = 'Up';
        moveUpBtn.className = 'task-btn';

        // Move Down button
        const moveDownBtn = document.createElement('button');
        moveDownBtn.textContent = 'Down';
        moveDownBtn.className = 'task-btn';

        // Duplicate button for duplication
        const duplicateBtn = document.createElement('button');
        duplicateBtn.textContent = 'Duplicate';
        duplicateBtn.className = 'task-btn';

        // Edit functionality
        editBtn.addEventListener('click', () => {
            taskSpan.style.display = 'none';
            editInput.style.display = 'inline';
            editInput.value = taskSpan.textContent;
            updateBtn.style.display = 'inline';
            editBtn.style.display = 'none';
        });

        // Update functionality
        updateBtn.addEventListener('click', () => {
            taskSpan.textContent = editInput.value;
            taskSpan.style.display = 'inline';
            editInput.style.display = 'none';
            updateBtn.style.display = 'none';
            editBtn.style.display = 'inline';
            updateBtn.className = 'task-btn';
            saveTasks();
        });

        // Delete functionality
        deleteBtn.addEventListener('click', () => {
            taskToDelete = li;
            confirmModal.style.display = 'flex';
        });

        // Confirm deletion
        confirmDeleteBtn.addEventListener('click', () => {
            if (taskToDelete) {
                taskToDelete.remove();
                taskToDelete = null;
                saveTasks();
            }
            confirmModal.style.display = 'none';
        });

        // Cancel deletion
        cancelDeleteBtn.addEventListener('click', () => {
            taskToDelete = null;
            confirmModal.style.display = 'none';
        });

        // Move Up functionality
        moveUpBtn.addEventListener('click', () => {
            const previousLi = li.previousElementSibling;
            if (previousLi) {
                taskList.insertBefore(li, previousLi);
                saveTasks();
            }
        });

        // Move Down functionality
        moveDownBtn.addEventListener('click', () => {
            const nextLi = li.nextElementSibling;
            if (nextLi) {
                taskList.insertBefore(nextLi, li);
                saveTasks();
            }
        });

        // Duplicate functionality
        duplicateBtn.addEventListener('click', () => {
            const duplicatedTaskText = taskSpan.textContent;
            createTask(duplicatedTaskText, li);
            saveTasks();
        });
        
        // Checkbox for marking task as completed
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.className = 'task-checkbox';
        checkBox.checked = isCompleted;
        checkBox.addEventListener('change', () => {
            if (checkBox.checked) {
                taskSpan.style.textDecoration = 'line-through'; // Mark task as completed
            } else {
                taskSpan.style.textDecoration = 'none'; // Unmark task as completed
            }
            saveTasks(); // Save tasks to local storage
        });
        li.appendChild(checkBox);

        // Append buttons to the list item
        li.appendChild(editBtn);
        li.appendChild(updateBtn);
        li.appendChild(deleteBtn);
        li.appendChild(moveUpBtn);
        li.appendChild(moveDownBtn);
        li.appendChild(duplicateBtn);

        // Insert task after the specified element, or at the end of the list
        if (insertAfterElement) {
            taskList.insertBefore(li, insertAfterElement.nextElementSibling);
        } else {
            taskList.appendChild(li);
        }

        if (isNew) saveTasks(); // Save tasks to local storage if it's a new task
    }

    // Event listener for adding a new task
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value;
        if (taskText !== '') {
            createTask(taskText);
            taskInput.value = ''; // Clear the input field
        }
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            confirmModal.style.display = 'none';
            taskToDelete = null;
        }
    });

    // Load tasks when the page loads
    // loadTasks();
});
