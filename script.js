// Initialize an empty array to store tasks
let tasks = [];

// Boolean flags to control the visibility of the tasks
allTaskSection = true;
sortedSection = false; 

// Boolean flags to see what mode the user is using if any
editMode = true;
deleteMode = false; 

// Event listener for the DOMContentLoaded event to initialize the tasks when the document is fully loaded
document.addEventListener("DOMContentLoaded", ()=> {
    // loading the tasks from the backend, updating the display and reseting the mode to ideal state
    loadTasks();
    updateTasks();
    updateMode(); 
});

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tempTask = JSON.parse(localStorage.getItem("tasks"));
    if (tempTask) { tasks = tempTask; }
}

// // Function to save tasks by sending them to a server-side PHP script using POST request
// function saveTasks() {
//     fetch('saveTasks.php', { // Send a fetch request to saveTasks.php
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(tasks) // Convert tasks array to JSON string and set as request body
//     })
// }

// // Function to load tasks by fetching them from a server-side PHP script
// function loadTasks() {
//     fetch('loadTasks.php') // Send a fetch request to loadTasks.php
//         .then(response => response.json()) // Parse the response as JSON
//         .then(data => {
//             tasks = data; // Update tasks array with fetched data
//         });
// }

// Function to toggle the display of the task form between none (hidden) and block (visible)
function toggleTaskForm() {
    let taskForm = document.getElementById('task-form'); // Get the task form element by its ID
    taskForm.style.display = (taskForm.style.display == 'none') ? 'block' : 'none'; // Toggle display style
}

// Adding Task given from task form
function addTask() {
    // Getting submited values from the task form
    let inputName = document.getElementById('name').value;
    let inputDate = document.getElementById('date').value;
    let inputDescription = document.getElementById('description').value;
    
    // adding it to the main tasks array
    tasks.push( {
        completed: false,
        name: inputName,
        date: inputDate,
        description: inputDescription,
    } );

    // Saving the task to the backend, Udating the display and reseting the mode to ideal state
    saveTasks();
    updateTasks();
    updateMode();
}

// Updating task on to the display
function updateTask(taskItem, task) {
    // Removing any old task information
    taskItem.innerHTML = '';

    // Creating the checkbox and applying the state accordingly
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.onclick = ()=> {
        task.completed = !task.completed;
        saveTasks();
        updateTasks();
    };
    taskItem.appendChild(checkbox);

    // Creating the task Name
    const name = document.createElement('h1');
    name.innerText = task.name;
    taskItem.appendChild(name);
 
    // Creating a div box for date information
    const calender = document.createElement('div');
    calender.className = 'calender';
    taskItem.appendChild(calender);

    // Creating the date icon
    const calenderIcon = document.createElement('img');
    calenderIcon.src = 'calender.webp';
    calenderIcon.width = 25;
    calenderIcon.height = 25;
    calender.appendChild(calenderIcon);

    // creating the date text
    const date = document.createElement('h3');
    date.innerText = task.date;
    calender.appendChild(date)

    // Creating a div for the task description
    const taskDescription = document.createElement('div');
    taskDescription.className = 'task-description';

    // creating the description text
    const description = document.createElement('p');
    description.innerText = task.description; // Assuming 'task.description' holds the task's description
    taskDescription.appendChild(description);

    // Adding the task description to the main task item
    taskItem.appendChild(taskDescription);

    taskItem.onclick = toggleDescription;
}

// Updating tasks on to the display
function updateTasks() {
    // Gets the tasks container and clears any previous task within
    let tasksList = document.getElementById('tasks-list');
    tasksList.innerHTML = '';

    // Adding each task to the display
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

function toggleDescription(event) {
    
    // Prevent the click event from triggering checkbox state changes or other handlers
    event.stopPropagation();

    // Navigate to the parent task item from the target, then find the task description within it
    let taskItem = event.currentTarget; // Use currentTarget to refer to the item the event handler is directly attached to
    let description = taskItem.querySelector('.task-description');

    // Toggle visibility and adjust padding based on description div's height
    if (description.style.display === "none" || description.style.display === "") {
        description.style.display = "block";
        // After the description is made visible, measure its height
        let descriptionHeight = description.offsetHeight; // Get the visible height of the description element
        // Set the bottom margin to be the height of the description plus an additional 20px
        taskItem.style.marginBottom = (descriptionHeight + 20) + 'px';
    } else {
        description.style.display = "none";
        // Reset the bottom margin when the description is hidden
        taskItem.style.marginBottom = "20px"; // You can adjust this value if you want different spacing when hidden
    }
}

// Function to select a particular section based on sectionID.
function selectSection(sectionID) {
    // Retrieves all elements with the class 'section-button'.
    let sections = document.querySelectorAll('.section-button'); 
    // Iterates through each section and sets its class name.
    sections.forEach(section => {
        // Applies 'selected-section' class to the section with matching ID, others just get 'section-button'.
        section.className = 'section-button' + (section.id == sectionID ? ' selected-section' : '');
    });
    // Flags to indicate if 'all tasks' or 'completed tasks' section is selected.
    allTaskSection = sectionID == 'allTasks';
    sortedSection = sectionID == 'completedTasks';
    // Updates tasks display based on the selected section.
    updateTasks();
}

// Function to open the menu sidebar.
function openMenu() {
    // Accesses the menu open-arrow element and changes its text to '<'.
    let arrow = document.getElementById('open-arrow');
    arrow.innerText = '<';
    // Changes the click event for the arrow to close the menu when clicked next.
    arrow.onclick = closeMenu;

    // Displays the menu by changing its style.
    let menu = document.getElementById('menu');
    menu.style.display = 'block';

    // Adjusts the style of the tasks container to match the open menu.
    let tasksContainer = document.getElementById('tasks-container');
    tasksContainer.style.borderRadius = '35px 0px 0px 35px';

    // Further adjusts the tasks container's header border radius.
    document.getElementById('tasks-container').style.setProperty('--tasks-header-border-radius', '35px 0px 0px 0px');
}

// Function to close the menu sidebar.
function closeMenu() {
    // Updates tasks and mode upon closing the menu.
    updateTasks();
    updateMode();
    
    // Changes the menu button to show '>', indicating the menu is closed.
    let arrow = document.getElementById('open-arrow');
    arrow.innerText = '>';
    arrow.onclick = openMenu;

    // Hides the menu by changing its display style.
    let menu = document.getElementById('menu');
    menu.style.display = 'none';

    // Resets the tasks container's border radius.
    let tasksContainer = document.getElementById('tasks-container');
    tasksContainer.style.borderRadius = '35px';

    // Resets the tasks container's header border radius.
    document.getElementById('tasks-container').style.setProperty('--tasks-header-border-radius', '35px 35px 0px 0px');
}

// Function to toggle the position and state of a switch or button.
function moveToggle() {
    // Retrieves the toggle element and its current style.
    let toggle = document.getElementById('toggle');
    let computedStyle = getComputedStyle(toggle);

    // Switches the toggle's side position between 5px and 85px.
    let toggleSide = computedStyle.getPropertyValue('--toggle-side'); 
    toggle.style.setProperty('--toggle-side', toggleSide == '5px' ? '85px' : '5px');

    // Toggles between 'EDIT' and 'DELETE' states.
    let state = computedStyle.getPropertyValue('--toggle-state').replace(/['"]+/g, '');
    toggle.style.setProperty('--toggle-state', state == 'EDIT' ? `'DELETE'` : `'EDIT'`);

    // Adjusts the position of the toggle's text.
    let textPos = computedStyle.getPropertyValue('--toggle-text-pos');
    toggle.style.setProperty('--toggle-text-pos', textPos == '30px' ? '10px' : '30px');

    // Toggles between edit and delete modes.
    editMode = !editMode;
    deleteMode = !deleteMode;

    // Updates the mode and tasks based on the new state.
    updateMode();
    updateTasks();
}

// Function to update the mode, recreating buttons based on edit or delete mode.
function updateMode() {
    let buttonList = document.getElementById('button-list');
    buttonList.innerHTML = '';
    // Only adds buttons if either edit or delete mode is active.
    if (editMode || deleteMode) {
        // Creates a new button for each task, setting it to edit or delete based on the mode.
        tasks.forEach((task, index) => {
            let button = document.createElement('button');
            button.className = 'mode-btn';
            button.innerText = editMode ? 'Edit' : 'Delete';
            button.id = index;
            button.onclick = editMode ? editTask : deleteTask;
            buttonList.appendChild(button);
        });
    }
}

// Function to handle the deletion of a task.
function deleteTask(event) {
    // Removes the task based on the id of the event's target.
    tasks.splice(event.target.id, 1);
    // Saves the updated tasks list and updates the UI.
    saveTasks();
    updateTasks();
    updateMode();
}

// Function to edit a task, allowing changes to its details.
function editTask(event) {
    let currentIndex = event.target.id; // Retrieves the index of the task being edited.

    // Changes the button text to 'Apply' and sets its click function to apply the edit.
    event.target.innerText = 'Apply';
    event.target.onclick = applyEdit;

    // Finds the task item in the DOM and clears its inner HTML to prepare for new input fields.
    let taskItems = document.getElementsByClassName('task');
    let taskItem = taskItems[currentIndex];
    taskItem.innerHTML = '';

    // Creates a new selection field for task priority and adds it to the task item.
    let prioritySelection = document.createElement('select');
    taskItem.appendChild(prioritySelection);

    // Populates the priority selection with options.
    tasks.forEach((task, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.innerText = index + 1; // Sets the display to be 1-based.
        option.selected = index == currentIndex; // Marks the current task's priority as selected.
        prioritySelection.appendChild(option);
    });

    // Adds a text input field for the task name, pre-filled with the current name.
    let nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = tasks[currentIndex].name;
    taskItem.appendChild(nameInput);
    
    // Adds a date input field for the task deadline, pre-filled with the current date.
    let dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = tasks[currentIndex].date;
    taskItem.appendChild(dateInput);

    // Adds styling to indicate the task is in edit state.
    taskItem.classList.add('editState');
}

// Function to apply changes made in the editTask form.
function applyEdit(event) {
    // Changes the button text back to 'Edit' and resets its onclick function.
    event.target.innerText = 'Edit';
    event.target.onclick = editTask;

    // Retrieves the edited task item and its new values from the input fields.
    let taskItems = document.getElementsByClassName('task');
    let taskItem = taskItems[event.target.id];
    taskItem.classList.remove('editState'); // Removes the edit state styling.

    // Updates the task's name and date with the new values entered by the user.
    let textInput = taskItem.querySelector('input[type="text"]');
    tasks[event.target.id].name = textInput.value;

    let dateInput = taskItem.querySelector('input[type="date"]');
    tasks[event.target.id].date = dateInput.value;

    // Checks if the task's priority has been changed and updates accordingly.
    let prioritySelection = taskItem.querySelector('select');
    if (prioritySelection.value != event.target.id) {
        // Moves the task to its new position if priority has changed.
        newPosition(tasks, event.target.id, prioritySelection.value);
        // Updates the mode and tasks since the list has changed.
        updateMode();
        updateTasks();
    } else {
        // If priority hasn't changed, just update the individual task display.
        updateTask(taskItem, tasks[event.target.id]);
    }

    // Saves the updated tasks to storage.
    saveTasks();
}

// Utility function to change a task's position in the array (used when priority changes).
function newPosition(array, oldIndex, newIndex) {
    // Removes the task from its old position and inserts it at the new position.
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
}