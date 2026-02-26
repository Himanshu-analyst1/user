const ADMIN_USERNAME = "himanshu123";

let users = JSON.parse(localStorage.getItem("users")) || [];

const demoProfiles = [
  {
    id: 1,
    name: "John Doe",
    bio: "Frontend Developer",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    owner: "demo"
  },
  {
    id: 2,
    name: "Jane Smith",
    bio: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    owner: "demo"
  }
];

if (users.length === 0) {
  users = demoProfiles;
  localStorage.setItem("users", JSON.stringify(users));
}

let currentUser = localStorage.getItem("currentUser");

const userContainer = document.getElementById("userContainer");
const searchInput = document.getElementById("search");
const clearDataBtn = document.getElementById("clearDataBtn");
const userForm = document.getElementById("userForm");

const loginModal = document.getElementById("loginModal");
const openLogin = document.getElementById("openLogin");
const closeLogin = document.getElementById("closeLogin");
const loginBtn = document.getElementById("loginBtn");
const currentUserDisplay = document.getElementById("currentUserDisplay");

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function displayUsers(filteredUsers = users) {
  userContainer.innerHTML = "";

  filteredUsers.forEach(user => {
    const card = document.createElement("div");
    card.classList.add("card");

    let deleteBtn = "";

    if (currentUser === user.owner || currentUser === ADMIN_USERNAME) {
      deleteBtn = `<button onclick="deleteUser(${user.id})">Delete</button>`;
    }

    card.innerHTML = `
      <img src="${user.image}">
      <h3>${user.name}</h3>
      <p>${user.bio}</p>
      <small>Added by: ${user.owner}</small>
      ${deleteBtn}
    `;

    userContainer.appendChild(card);
  });
}

function deleteUser(id) {
  users = users.filter(user => user.id !== id);

  if (users.length === 0) {
    users = demoProfiles;
  }

  saveUsers();
  displayUsers();
}

function createUser(name, bio, image) {
  const newUser = {
    id: Date.now(),
    name,
    bio,
    image,
    owner: currentUser
  };

  users.push(newUser);
  saveUsers();
  displayUsers();
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("bio").value = "";
  document.getElementById("imageUrl").value = "";
  document.getElementById("imageFile").value = "";
}

userForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!currentUser) {
    alert("Please login first");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const imageUrl = document.getElementById("imageUrl").value.trim();
  const imageFile = document.getElementById("imageFile").files[0];

  if (!name || !bio) {
    alert("Please fill all fields");
    return;
  }

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      createUser(name, bio, e.target.result);
      clearForm();
    };
    reader.readAsDataURL(imageFile);
  } else {
    createUser(name, bio, imageUrl || "https://via.placeholder.com/200");
    clearForm();
  }
});

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = users.filter(user =>
    user.name.toLowerCase().includes(value)
  );
  displayUsers(filtered);
});

clearDataBtn.addEventListener("click", () => {
  if (confirm("Reset everything?")) {
    localStorage.clear();
    location.reload();
  }
});

openLogin.addEventListener("click", () => {
  loginModal.classList.add("active");
});

closeLogin.addEventListener("click", () => {
  loginModal.classList.remove("active");
});

loginBtn.addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter username");

  currentUser = username;
  localStorage.setItem("currentUser", username);
  loginModal.classList.remove("active");
  updateUserDisplay();
  displayUsers();
});

function updateUserDisplay() {
  if (currentUser) {
    currentUserDisplay.innerText =
      currentUser === ADMIN_USERNAME
        ? `Logged in as ADMIN (${currentUser})`
        : `Logged in as ${currentUser}`;
  }
}

updateUserDisplay();
displayUsers();