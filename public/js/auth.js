const API = "http://localhost:5000/api";

// Save token
function saveToken(t) {
    localStorage.setItem("token", t);
}

// Get token
function getToken() {
    return localStorage.getItem("token");
}

// Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
