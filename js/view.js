const params = new URLSearchParams(window.location.search);
const userId = params.get('user_id');

if (userId) {
    const decodedData = JSON.parse(atob(userId)); // Base64 decode
    const profileInfo = document.getElementById('profile-info');

    for (const [key, value] of Object.entries(decodedData)) {
        const iconClass = {
            name: 'fas fa-user',
            surname: 'fas fa-user-tag',
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
} else {
    document.getElementById('profile-info').innerHTML = '<p>No user ID provided.</p>';
}
