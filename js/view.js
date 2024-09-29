function loadProfile(userId) {
    const decodedData = decodeProfileData(userId); // Base62 decode
    const profileInfo = document.getElementById('profile-info');

    profileInfo.innerHTML = ''; // Clear any previous profile data
    for (const [key, value] of Object.entries(decodedData)) {
        const iconClass = {
            name: 'fas fa-user',
            surname: 'fas fa-user-tag',
            pronouns: 'fas fa-user-check',
            gender: 'fas fa-venus-mars',
            email: 'fas fa-envelope',
            phone: 'fas fa-phone',
            website: 'fas fa-globe',
            github: 'fab fa-github',
            instagram: 'fab fa-instagram',
            twitter: 'fab fa-twitter',
            facebook: 'fab fa-facebook',
            youtube: 'fab fa-youtube'
        }[key];

        if (value) {
            profileInfo.innerHTML += `
                <div class="profile-item">
                    <i class="${iconClass}"></i>
                    <span>${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}</span>
                </div>
            `;
        }
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');
    if (userId) {
        loadProfile(userId);
    } else {
        document.getElementById('profile-info').innerHTML = '<p>No user ID provided.</p>';
    }
});
