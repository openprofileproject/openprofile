document.getElementById('profile-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const profileData = Object.fromEntries(formData.entries());
    const encodedData = btoa(JSON.stringify(profileData)); // Base64 encode

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h2>Generated User ID:</h2>
        <p>${encodedData}</p>
        <h3>View Profile:</h3>
        <a href="view.html?user_id=${encodedData}" target="_blank">View Profile</a>
    `;
});
