let tasks = []   
allTaskSection = true;
sortedSection = false;
editMode = true;
deleteMode = false;

function toggleTaskForm() {
    let taskForm = document.getElementById('task-form');
    taskForm.style.display = (taskForm.style.display == 'none') ? 'block' : 'none';
}

document.addEventListener("DOMContentLoaded", ()=> {
    loadTasks();
    updateTasks();
    updateMode();
});

// function saveTasks() { localStorage.setItem("tasks", JSON.stringify(tasks)); }
// function loadTasks() { tasks = JSON.parse(localStorage.getItem("tasks")); }

function saveTasks() {
    fetch('saveTasks.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks)
    })
}

function loadTasks() {
    fetch('loadTasks.php')
        .then(response => response.json())
        .then(data => {
            tasks = data;
            console.log(tasks)
        });
}

function updateTask(taskItem, task) {
    taskItem.innerHTML = '';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.onclick = ()=> {
        task.completed = !task.completed;
        saveTasks();
        updateTasks();
    };
    taskItem.appendChild(checkbox);

    const name = document.createElement('h1');
    name.innerText = task.name;
    taskItem.appendChild(name);

    const calender = document.createElement('div');
    calender.className = 'calender';
    taskItem.appendChild(calender);

    const calenderIcon = document.createElement('img');
    calenderIcon.src = 'calender.webp';
    calenderIcon.width = 25;
    calenderIcon.height = 25;
    calender.appendChild(calenderIcon);

    const date = document.createElement('h3');
    date.innerText = task.date;
    calender.appendChild(date)
}

function updateTasks() {
    let tasksList = document.getElementById('tasks-list');
    tasksList.innerHTML = '';
    tasks.forEach(task => {
        if (allTaskSection || task.completed == sortedSection) {
            const taskItem = document.createElement('div');
            taskItem.className = 'task';
            if (task.completed) { taskItem.className += ' completed'; }
            tasksList.appendChild(taskItem);
            updateTask(taskItem, task);
        }
    });
}

function addTask() {
    let inputName = document.getElementById('name').value;
    let inputDate = document.getElementById('date').value;
    let inputDescription = document.getElementById('description').value;
    tasks.push( {
        completed: false,
        name: inputName,
        date: inputDate,
        description: description,
    } );
    saveTasks();
    updateTasks();
    updateMode();
}

function selectSection(sectionID) {
    let sections = document.querySelectorAll('.section-button');
    sections.forEach(section => {
        section.className = 'section-button' + (section.id == sectionID ? ' selected-section' : '');
    });
    allTaskSection = sectionID == 'allTasks';
    sortedSection = sectionID == 'completedTasks';
    updateTasks();
}

function openMenu() {
    let arrow = document.getElementById('open-arrow');
    arrow.innerText = '<';
    arrow.onclick = closeMenu;

    let menu = document.getElementById('menu');
    menu.style.display = 'block';

    let tasksContainer = document.getElementById('tasks-container');
    tasksContainer.style.borderRadius = '35px 0px 0px 35px';

    document.getElementById('tasks-container').style.setProperty('--tasks-header-border-radius', '35px 0px 0px 0px');
}

function closeMenu() {
    updateTasks();
    updateMode();
    
    let arrow = document.getElementById('open-arrow');
    arrow.innerText = '>';
    arrow.onclick = openMenu;

    let menu = document.getElementById('menu');
    menu.style.display = 'none';

    let tasksContainer = document.getElementById('tasks-container');
    tasksContainer.style.borderRadius = '35px';

    document.getElementById('tasks-container').style.setProperty('--tasks-header-border-radius', '35px 35px 0px 0px');
}

function moveToggle() {
    let toggle = document.getElementById('toggle');
    let computedStyle = getComputedStyle(toggle);

    let toggleSide = computedStyle.getPropertyValue('--toggle-side'); 
    if (toggleSide == '5px') { toggle.style.setProperty('--toggle-side', '85px'); } 
    else { toggle.style.setProperty('--toggle-side', '5px'); }

    let state = computedStyle.getPropertyValue('--toggle-state').replace(/['"]+/g, '');
    if (state == 'EDIT') { toggle.style.setProperty('--toggle-state', `'DELETE'`); }
    else { toggle.style.setProperty('--toggle-state', `'EDIT'`); }

    let textPos = computedStyle.getPropertyValue('--toggle-text-pos');
    if (textPos == '30px') { toggle.style.setProperty('--toggle-text-pos', '10px'); }
    else { toggle.style.setProperty('--toggle-text-pos', '30px'); }

    editMode = !editMode;
    deleteMode = !deleteMode;

    updateMode();
    updateTasks();
}

function updateMode() {
    let buttonList = document.getElementById('button-list');
    buttonList.innerHTML = '';
    if (editMode || deleteMode) {
        tasks.forEach( (task, index) => {
            let button = document.createElement('button');
            button.className = 'mode-btn'
            button.innerText = (editMode)? 'Edit': 'Delete';
            button.id = index;
            button.onclick = (editMode)? editTask: deleteTask;
            buttonList.appendChild(button);
        });
    }
}

function deleteTask(event) { tasks.splice(event.target.id, 1); saveTasks(); updateTasks(); updateMode(); }
function editTask(event) { 
    let currentIndex = event.target.id;

    event.target.innerText = 'Apply';
    event.target.onclick = applyEdit;

    let taskItems = document.getElementsByClassName('task');
    let taskItem = taskItems[currentIndex];
    taskItem.innerHTML = '';

    let prioritySelection = document.createElement('select');
    taskItem.appendChild(prioritySelection);

    tasks.forEach( (task, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.innerText = index+1;
        option.selected = index == currentIndex;
        prioritySelection.appendChild(option);
    });

    let nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = tasks[currentIndex].name;
    taskItem.appendChild(nameInput);
    
    let dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = tasks[currentIndex].date;
    taskItem.appendChild(dateInput);
    taskItem.classList.add('editState');
}

function applyEdit(event) {
    event.target.innerText = 'Edit';
    event.target.onclick = editTask;

    let taskItems = document.getElementsByClassName('task');
    let taskItem = taskItems[event.target.id];
    taskItem.classList.remove('editState');

    let textInput = taskItem.querySelector('input[type="text"]');
    tasks[event.target.id].name = textInput.value;

    let dateInput = taskItem.querySelector('input[type="date"]');
    tasks[event.target.id].date = dateInput.value;

    let prioritySelection = taskItem.querySelector('select');
    if (prioritySelection.value != event.target.id) {
        newPosition(tasks, event.target.id, prioritySelection.value);
        updateMode();
        updateTasks();
    }
    else { updateTask(taskItem, tasks[event.target.id]); }

    saveTasks();
}

function newPosition(array, oldIndex, newIndex) { array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]); }