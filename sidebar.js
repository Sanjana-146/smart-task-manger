function toggleDropdown() {
    let dropdown = document.getElementById("taskDropdown");
    let analytics = document.getElementById("analytics");
    
    dropdown.classList.toggle("hidden");
    
    if (!dropdown.classList.contains("hidden")) {
        analytics.classList.add("hidden");
    } else {
        analytics.classList.remove("hidden");
    }
}

function showPage(pageId) {
    document.getElementById("todayTasks").classList.add("hidden");
    document.getElementById("previousTasks").classList.add("hidden");

    document.getElementById(pageId).classList.remove("hidden");
}

function toggleProfileDropdown() {
    document.getElementById("profileDropdown").classList.toggle("hidden");
}

// Close dropdowns when clicking outside
document.addEventListener("click", function (event) {
    let taskDropdown = document.getElementById("taskDropdown");
    let analytics = document.getElementById("analytics");
    let myTasks = document.getElementById("myTasks");
    let profileDropdown = document.getElementById("profileDropdown");
    let profileIcon = document.getElementById("profileIcon");

    if (!myTasks.contains(event.target)) {
        taskDropdown.classList.add("hidden");
        analytics.classList.remove("hidden");
    }

    if (!profileIcon.contains(event.target)) {
        profileDropdown.classList.add("hidden");
    }
});