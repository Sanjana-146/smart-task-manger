// document.addEventListener("DOMContentLoaded", loadTodayTasks);

// function loadTodayTasks() {
//     const todayTaskList = document.getElementById("todayTaskList");
//     todayTaskList.innerHTML = "";

//     const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//     const todayDate = new Date().toISOString().split("T")[0];

//     const todayTasks = tasks.filter(task => task.date === todayDate);

//     if (todayTasks.length === 0) {
//         todayTaskList.innerHTML = "<p class='text-gray-600'>No tasks for today.</p>";
//         return;
//     }

//     todayTasks.forEach((task, index) => {
//         const li = document.createElement("li");
//         li.classList.add("flex", "items-center", "justify-between", "p-2", "border-b");

//         const checkbox = document.createElement("input");
//         checkbox.type = "checkbox";
//         checkbox.checked = task.completed;
//         checkbox.classList.add("mr-2");
//         checkbox.addEventListener("change", () => toggleTodayTask(index));

//         const span = document.createElement("span");
//         span.textContent = `${task.date}: ${task.text}`;
//         if (task.completed) span.classList.add("line-through", "text-gray-400");

//         li.appendChild(checkbox);
//         li.appendChild(span);
//         todayTaskList.appendChild(li);
//     });
// }

// function toggleTodayTask(index) {
//     let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//     tasks[index].completed = !tasks[index].completed;
//     localStorage.setItem("tasks", JSON.stringify(tasks));
//     loadTodayTasks();
// }


document.addEventListener("DOMContentLoaded", loadTodayTasks);
function getLocalDate() {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Adjust for timezone
    return today.toISOString().split("T")[0]; // Get YYYY-MM-DD
}
async function loadTodayTasks() {
    const todayTaskList = document.getElementById("todayTaskList");
    todayTaskList.innerHTML = "<p class='text-gray-600'>Loading...</p>";

    const todayDate = getLocalDate(); // ✅ Use local date

    try {
        const response = await fetch(`http://localhost:7001/get-tasks/${todayDate}`);
        const tasks = await response.json();

        todayTaskList.innerHTML = ""; // Clear loading text

        if (tasks.length === 0) {
            todayTaskList.innerHTML = "<p class='text-gray-600'>No tasks for today.</p>";
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.classList.add("flex", "items-center", "justify-between", "p-2", "border-b");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("mr-2");
            checkbox.checked = false; // No completed field in MongoDB yet

            const span = document.createElement("span");
            span.textContent = task;
            
            li.appendChild(checkbox);
            li.appendChild(span);
            todayTaskList.appendChild(li);
        });

    } catch (error) {
        console.error("Error fetching tasks:", error);
        todayTaskList.innerHTML = "<p class='text-red-500'>Failed to load tasks.</p>";
    }
}

// async function loadTodayTasks() {
//     const todayTaskList = document.getElementById("todayTaskList");
//     todayTaskList.innerHTML = "<p class='text-gray-600'>Loading...</p>";

//     const todayDate = new Date().toISOString().split("T")[0];

//     try {
//         const response = await fetch(`http://localhost:7001/get-tasks/${todayDate}`);
//         const tasks = await response.json();

//         todayTaskList.innerHTML = ""; // Clear the loading text

//         if (tasks.length === 0) {
//             todayTaskList.innerHTML = "<p class='text-gray-600'>No tasks for today.</p>";
//             return;
//         }

//         tasks.forEach((task, index) => {
//             const li = document.createElement("li");
//             li.classList.add("flex", "items-center", "justify-between", "p-2", "border-b");

//             const checkbox = document.createElement("input");
//             checkbox.type = "checkbox";
//             checkbox.classList.add("mr-2");
//             checkbox.checked = false; // No completed field in MongoDB yet
//             checkbox.addEventListener("change", () => toggleTodayTask(index));

//             const span = document.createElement("span");
//             span.textContent = task;
            
//             li.appendChild(checkbox);
//             li.appendChild(span);
//             todayTaskList.appendChild(li);
//         });

//     } catch (error) {
//         console.error("Error fetching tasks:", error);
//         todayTaskList.innerHTML = "<p class='text-red-500'>Failed to load tasks.</p>";
//     }
// }

// Function to toggle task completion (placeholder for now)
function toggleTodayTask(index) {
    alert("Task completion toggling isn't implemented in the database yet.");
}
