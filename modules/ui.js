export function setupUI(auth, db) {
    const navHome = document.getElementById("nav-home");
    const navSettings = document.getElementById("nav-settings");
    const navProfile = document.getElementById("nav-profile");

    const homeSection = document.getElementById("home");
    const settingsSection = document.getElementById("settings");
    const profileSection = document.getElementById("profile");

    // Navbar click handlers
    navHome.addEventListener("click", () => {
        homeSection.style.display = "block";
        settingsSection.style.display = "none";
        profileSection.style.display = "none";
        navHome.classList.add("active");
        navSettings.classList.remove("active");
        navProfile.classList.remove("active");
    });

    navSettings.addEventListener("click", () => {
        homeSection.style.display = "none";
        settingsSection.style.display = "block";
        profileSection.style.display = "none";
        navHome.classList.remove("active");
        navSettings.classList.add("active");
        navProfile.classList.remove("active");
    });

    navProfile.addEventListener("click", () => {
        homeSection.style.display = "none";
        settingsSection.style.display = "none";
        profileSection.style.display = "block";
        navHome.classList.remove("active");
        navSettings.classList.remove("active");
        navProfile.classList.add("active");
    });
}