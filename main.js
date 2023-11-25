document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");
    // Load tasks from local storage on page load
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    console.log('Tasks loaded from local storage:', savedTasks);
    savedTasks.forEach(savedTask => {
        const task_el = createTaskElement(savedTask);
        list_el.appendChild(task_el); // Append the task element to #tasks
});

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = input.value;

        if (taskText.trim() === "") {
            alert("Please enter a task!");
            return;
        }

        // Create task element and add it to the list
        const task_el = createTaskElement(taskText);
        list_el.appendChild(task_el);

        // Save tasks to local storage
        saveTasksToLocalStorage();

        input.value = '';
    });

    // Event delegation for task actions
    list_el.addEventListener('click', (e) => {
        const target = e.target;
        const task_el = target.closest('.task');

        if (!task_el) return;

        if (target.classList.contains('delete')) {
            // Remove task element from the list
            list_el.removeChild(task_el);
            // Save tasks to local storage after removal
            saveTasksToLocalStorage();
        }
    });

    function createTaskElement(taskText) {
        console.log('Creating task element:', taskText);

        const task_el = document.createElement('div');
        task_el.classList.add('task');

        const task_content_el = document.createElement('div');
        task_content_el.classList.add('content');

        const task_input_el = document.createElement('input');
        task_input_el.classList.add('text');
        task_input_el.type = 'text';
        task_input_el.value = taskText;
        task_input_el.setAttribute('readonly', 'readonly');

        task_content_el.appendChild(task_input_el);
        task_el.appendChild(task_content_el);

        const task_actions_el = document.createElement('div');
        task_actions_el.classList.add('actions');

        const task_edit_el = document.createElement('button');
        task_edit_el.classList.add('edit');
        task_edit_el.innerText = 'Edit';

        const task_delete_el = document.createElement('button');
        task_delete_el.classList.add('delete');
        task_delete_el.innerText = 'Delete';

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);

        task_el.appendChild(task_actions_el);

        // Event listener for task editing
        task_edit_el.addEventListener('click', () => {
            if (task_edit_el.innerText.toLowerCase() === "edit") {
                task_edit_el.innerText = "Save";
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
            } else {
                task_edit_el.innerText = "Edit";
                task_input_el.setAttribute("readonly", "readonly");
                // Save tasks to local storage after editing
                saveTasksToLocalStorage();
            }
        });

        console.log('Task element created:', task_el);
        return task_el;
    }

    function saveTasksToLocalStorage() {
        const tasks = Array.from(list_el.children).map(task_el => {
            const task_input_el = task_el.querySelector('.text');
            return task_input_el.value;
        });

        // Save tasks array to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        console.log('Tasks saved to local storage:', tasks);
    }
});