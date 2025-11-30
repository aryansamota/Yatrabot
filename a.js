/* ------------------ PAGE SWITCH ------------------ */
function showLogin() {
    loginPage.style.display = "block";
    signupPage.style.display = "none";
    forgotPage.style.display = "none";
    mainPage.style.display = "none";
}

function showSignup() {
    loginPage.style.display = "none";
    signupPage.style.display = "block";
    forgotPage.style.display = "none";
}

function showForgot() {
    loginPage.style.display = "none";
    signupPage.style.display = "none";
    forgotPage.style.display = "block";
}

/* ------------------ SIGNUP ------------------ */
function signup() {
    let user = document.getElementById("signUser").value;
    let pass = document.getElementById("signPass").value;

    if (user === "" || pass === "") {
        alert("Please enter username and password.");
        return;
    }

    localStorage.setItem("savedUser", user);
    localStorage.setItem("savedPass", pass);

    alert("Signup Successful! Login Now.");
    showLogin();
}

/* ------------------ LOGIN ------------------ */
function login() {
    let u = document.getElementById("loginUser").value;
    let p = document.getElementById("loginPass").value;

    let savedU = localStorage.getItem("savedUser");
    let savedP = localStorage.getItem("savedPass");

    if (u === savedU && p === savedP) {
        localStorage.setItem("loggedIn", "true");
        loadMain();
    } else {
        document.getElementById("loginError").innerText = "Invalid Login!";
    }
}

/* ------------------ RESET PASSWORD ------------------ */
function resetPassword() {
    let newPass = document.getElementById("resetPass").value;

    if (newPass === "") {
        alert("Enter new password");
        return;
    }

    localStorage.setItem("savedPass", newPass);
    alert("Password Reset! Login Now.");
    showLogin();
}

/* ------------------ LOAD MAIN PAGE ------------------ */
function loadMain() {
    loginPage.style.display = "none";
    signupPage.style.display = "none";
    forgotPage.style.display = "none";

    mainPage.style.display = "block";
}

/* Auto open main page if already logged in */
if (localStorage.getItem("loggedIn") === "true") {
    setTimeout(loadMain, 100);
}

/* ------------------ LOGOUT ------------------ */
function logout() {
    localStorage.removeItem("loggedIn");
    location.reload();
}

/* ------------------ DARK MODE ------------------ */
let mode = localStorage.getItem("mode") || "light";

applyMode();

function applyMode() {
    document.body.className = mode;
}

function toggleMode() {
    mode = mode === "light" ? "dark" : "light";
    localStorage.setItem("mode", mode);
    applyMode();
}

/* ------------------ CITY DATA ------------------ */
const cities = [
    { name: "Delhi", reviews: "Historic capital", places: ["Red Fort"], coords: [28.6139, 77.2090], hotels: ["The Imperial", "Leela Palace"] },
    { name: "Mumbai", reviews: "Bollywood city", places: ["Marine Drive"], coords: [19.0760, 72.8777], hotels: ["Taj Mahal Palace", "The Oberoi"] },
    { name: "Goa", reviews: "Beach paradise", places: ["Baga Beach"], coords: [15.2993, 74.1240], hotels: ["W Goa", "Taj Exotica"] }
];

/* ------------------ DISPLAY CITIES ------------------ */
function displayCities(list) {
    let box = document.getElementById("cities");
    box.innerHTML = "";

    list.forEach(city => {
        let card = document.createElement("div");
        card.className = "city-card";
        card.innerHTML = `
            <h3>${city.name}</h3>
            <p><b>Review:</b> ${city.reviews}</p>
            <p><b>Places:</b> ${city.places.join(", ")}</p>
            <p><b>Hotels:</b> ${city.hotels.join(", ")}</p>
        `;
        card.onclick = () => showOnMap(city);
        box.appendChild(card);
    });
}

/* ------------------ SEARCH ------------------ */
function searchCity() {
    let q = document.getElementById("searchBox").value.toLowerCase();
    let result = cities.filter(c => c.name.toLowerCase().includes(q));
    displayCities(result);
}

/* ------------------ DROPDOWNS ------------------ */
function loadDropdowns() {
    const d1 = document.getElementById("city1");
    const d2 = document.getElementById("city2");

    cities.forEach(c => {
        d1.innerHTML += `<option value="${c.name}">${c.name}</option>`;
        d2.innerHTML += `<option value="${c.name}">${c.name}</option>`;
    });
}

/* ------------------ COMPARE ------------------ */
function compareCities() {
    let c1 = city1.value;
    let c2 = city2.value;

    if (!c1 || !c2 || c1 === c2) {
        comparisonResult.innerHTML = "Select two different cities!";
        return;
    }

    let cityA = cities.find(c => c.name === c1);
    let cityB = cities.find(c => c.name === c2);

    comparisonResult.innerHTML = `
        <h3>${c1} vs ${c2}</h3>
        <p><b>Reviews:</b> ${cityA.reviews} | ${cityB.reviews}</p>
        <p><b>Places:</b> ${cityA.places.join(", ")} | ${cityB.places.join(", ")}</p>
        <p><b>Hotels:</b> ${cityA.hotels.join(", ")} | ${cityB.hotels.join(", ")}</p>
    `;
}

/* ------------------ MAP ------------------ */
let map = L.map("map").setView([20.5937, 78.9629], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    .addTo(map);

let currentMarker = null;

function showOnMap(city) {
    map.setView(city.coords, 10);

    if (currentMarker) currentMarker.remove();

    currentMarker = L.marker(city.coords)
        .addTo(map)
        .bindPopup(`<b>${city.name}</b><br>${city.reviews}`)
        .openPopup();
}

/* ------------------ INIT LOAD ------------------ */
displayCities(cities);
loadDropdowns();