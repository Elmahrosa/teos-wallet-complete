// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    // Save the user's preference in local storage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        localStorage.setItem('dark-mode', 'disabled');
    }
}

// Function to check the user's preference on page load
function checkDarkModePreference() {
    const darkModePreference = localStorage.getItem('dark-mode');
    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-mode');
    }
}

// Call the function to check the preference on page load
document.addEventListener('DOMContentLoaded', checkDarkModePreference);
