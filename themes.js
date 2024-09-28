function setTheme(theme) {
    const body = document.body;
    body.classList.remove('light', 'dark', 'github', 'discord', 'rainbow');
    body.classList.add(theme);
}

// Load the selected theme if stored in localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
        document.getElementById('themeSelector').value = savedTheme;
    }
});

// Save the selected theme
document.getElementById('themeSelector').addEventListener('change', function() {
    setTheme(this.value);
    localStorage.setItem('theme', this.value);
});
