const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("task");
const dateInput = document.getElementById("date");
const priorityInput = document.getElementById("priority");
const taskList = document.querySelector(".task-list");
const deleteAllBtn = document.querySelector(".delete-all");
const progressBar = document.getElementById("progress");
const numbers = document.getElementById("numbers");
const currentDateEl = document.querySelector(".current-date");
const currentTimeEl = document.querySelector(".current-time");
const profileNameEl = document.getElementById("profileName");
const profileJobEl = document.getElementById("profileJob");
const profileAvatarEl = document.getElementById("profileAvatar");

let profile = {
  name: localStorage.getItem('profileName') || null,
  job: localStorage.getItem('profileJob') || null
};

// Initialize profile on load
function initProfile() {
  if (profile.name) {
    profileNameEl.textContent = profile.name;
    profileAvatarEl.textContent = profile.name.charAt(0).toUpperCase();
  }
  if (profile.job) {
    profileJobEl.textContent = profile.job;
  }
}

// Edit profile function
function editProfile(type) {
  let currentValue, placeholder, newValue;
  
  if (type === 'name') {
    currentValue = profile.name || '';
    placeholder = 'Masukkan nama Anda';
    newValue = prompt(placeholder, currentValue);
    
    if (newValue && newValue.trim()) {
      newValue = newValue.trim();
      profile.name = newValue;
      profileNameEl.textContent = newValue;
      profileAvatarEl.textContent = newValue.charAt(0).toUpperCase();
      localStorage.setItem('profileName', newValue);
    }
  } else if (type === 'job') {
    currentValue = profile.job || '';
    placeholder = 'Masukkan profesi Anda';
    newValue = prompt(placeholder, currentValue);
    
    if (newValue && newValue.trim()) {
      newValue = newValue.trim();
      profile.job = newValue;
      profileJobEl.textContent = newValue;
      localStorage.setItem('profileJob', newValue);
    }
  }
}

// Update time function
function updateTime() {
  const now = new Date();
  
  // Format date in Indonesian
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const dateStr = now.toLocaleDateString('id-ID', options);
  
  // Format time
  const timeStr = now.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  currentDateEl.textContent = dateStr;
  currentTimeEl.textContent = timeStr;
}

// Update time every second
updateTime();
setInterval(updateTime, 1000);

// Store tasks and profile in memory
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  let doneCount = 0;

  if (tasks.length === 0) {
    const noTasksMsg = document.createElement("li");
    noTasksMsg.className = "no-tasks";
    noTasksMsg.textContent = "Belum ada tugas. Tambahkan tugas pertama Anda!";
    taskList.appendChild(noTasksMsg);
  }

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.classList.add(`${task.priority}-priority`);

    const left = document.createElement("div");
    left.className = "task-left";
    if (task.done) left.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      task.done = !task.done;
      saveAndRender();
    });

    const span = document.createElement("span");
    const priorityText = {
      'high': 'Tinggi',
      'medium': 'Sedang', 
      'low': 'Rendah'
    };
    span.textContent = `${task.text} (${task.date}, ${priorityText[task.priority]})`;

    left.appendChild(checkbox);
    left.appendChild(span);

    const right = document.createElement("div");
    right.className = "task-right";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.title = "Edit Task";
    editBtn.addEventListener("click", () => {
      const newText = prompt("Edit Task:", task.text);
      if (newText && newText.trim()) {
        task.text = newText.trim();
        saveAndRender();
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "Delete Task";
    deleteBtn.addEventListener("click", () => {
      if (confirm("Yakin ingin menghapus tugas ini?")) {
        tasks.splice(index, 1);
        saveAndRender();
      }
    });

    right.appendChild(editBtn);
    right.appendChild(deleteBtn);

    li.appendChild(left);
    li.appendChild(right);
    taskList.appendChild(li);

    if (task.done) doneCount++;
  });

  numbers.textContent = `${doneCount} / ${tasks.length}`;
  const percent = tasks.length ? (doneCount / tasks.length) * 100 : 0;
  progressBar.style.width = `${percent}%`;
  if(doneCount==tasks.length && doneCount > 0) conffetiEffect()
}

const conffetiEffect = () => {
  const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
}
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const date = dateInput.value;
  const priority = priorityInput.value;

  if (!text || !date || !priority) {
    alert("Mohon lengkapi semua field!");
    return;
  }

  // Check if date is in the past
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    const confirm = window.confirm("Tanggal yang dipilih sudah lewat. Yakin ingin menambahkan tugas ini?");
    if (!confirm) return;
  }

  tasks.push({ text, date, priority, done: false });
  taskInput.value = "";
  dateInput.value = "";
  priorityInput.selectedIndex = 0;

  saveAndRender();
});

deleteAllBtn.addEventListener("click", () => {
  if (tasks.length === 0) {
    alert("Tidak ada task untuk dihapus!");
    return;
  }
  const konfirmasi = confirm("Yakin ingin menghapus semua tugas?");
  if (konfirmasi) {
    tasks = [];
    saveAndRender();
  }
});

// Initial render
initProfile();
renderTasks();