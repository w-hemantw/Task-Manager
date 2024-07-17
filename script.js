
  const taskInput = document.getElementById("taskInput");
  const searchInput = document.getElementById("searchInput");
  const taskList = document.getElementById("taskList");
  const statusFilter = document.getElementById("statusFilter");
  const sortOrder = document.getElementById("sortOrder");
  const tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
  const taskHeading = document.getElementById("taskheadingInput");

  function addTask() {
    const taskText = taskInput.value.trim();
    const taskHead = taskHeading.value.trim();
    const selectedCategory = categorySelect.value; // Retrieve selected category
    const selectedDueDate = dueDateInput.value;
    if (taskText !== "") {
      const task = {
        id: new Date().getTime(),
        text: taskText,
        head: taskHead,
        category: selectedCategory, // Include the selected category
        dueDate: selectedDueDate,
        completed: false
      };
      tasks.push(task);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      updateTaskList();
      taskInput.value = "";
      taskHeading.value = "";
    }
  }
  

  function deleteTask(id) {
   const taskIndex=tasks.findIndex(task=>task.id===id);
   if(taskIndex!==-1)
   {
    tasks.splice(taskIndex,1);
    updateTaskList();
    localStorage.setItem("items",JSON.stringify(tasks));
   }
    
  }

  function editTask(id, newText,newhead) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex].text = newText;
      tasks[taskIndex].head=newhead;

      updateTaskList();
      localStorage.setItem("items", JSON.stringify(tasks));
    }
  }

  function toggleCompletion(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      updateTaskList();
    }
  }

  function filterTasks() {
    const selectedStatus = statusFilter.value;
    updateTaskList(selectedStatus);
  }

  function sortTasks() {
    const selectedSortOrder = sortOrder.value;
    tasks.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
  
      if (selectedSortOrder === "asc") {
        return dateA - dateB; 
      } else {
        return dateB - dateA; 
      }
    });
    updateTaskList();
  }
  
  function searchTasks() {
    const searchText = searchInput.value.trim().toLowerCase();
    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchText));
    updateTaskList(null, filteredTasks);
  }
  const dates=[];
  const d=new Date().getDate()+"-"+new Date().toLocaleString('default', { month: 'long' })+"-"+new Date().getFullYear()

 // Update the function updateTaskList to render task cards
 function updateTaskList(filterStatus = null, taskArray = tasks) {
  const taskGrid = document.getElementById("taskGrid");
  taskGrid.innerHTML = "";

  for (const task of taskArray) {
    if (
      filterStatus === null ||
      (filterStatus === "pending" && !task.completed) ||
      (filterStatus === "completed" && task.completed)
    ) {
      const taskCard = document.createElement("div");
      taskCard.className = "task-card";
      taskCard.innerHTML = `
      <div class="task-header">
        <h3>${task.head}</h3>
        <p>Category: ${task.category}</p>
      </div>
      <p>${task.text}</p>
      <span>${d}</span>
      <p>Status: ${task.completed ? 'Completed' : 'Pending'}</p>
      <p>Due Date: ${formatDate(task.dueDate)}</p>
      <div class="task-actions">
        <button onclick="toggleCompletion(${task.id})">${task.completed ? "Mark as Pending" : "Mark as Completed"}</button>
        <button onclick="editTaskPrompt(${task.id}, '${task.text}', '${task.head}')"><i class="fa fa-pencil"></i></button>
        <button onclick="deleteTask(${task.id})"><i class="fa fa-trash" style="color:red"></i></button>
      </div>
    `;
    
      taskGrid.appendChild(taskCard);
    }
  }
}
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}


  function editTaskPrompt(id, currentText,currhead) {
    const newText = prompt("Edit task:", currentText);
    const newhead=prompt("Edit description",currhead)
    if (newText !== null) {
      editTask(id, newText,newhead);
    }
  }
  

  taskInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

  searchInput.addEventListener("keyup", function(event) {
    searchTasks();
  });

  updateTaskList();

  const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));
  if (tasksFromLocalStorage) {
    tasksFromLocalStorage.forEach((task) => {
      addTask(task.text, task.head, task.category, task.dueDate);
    });
  }
  

