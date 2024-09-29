function loadProfile(userId) {
    const decodedData = decodeProfileData(userId); // Base62 decode
    const profileInfo = document.getElementById('profile-info');

    profileInfo.innerHTML = ''; // Clear any previous profile data
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
}

// Check if User ID is present in the URL
const params = new URLSearchParams(window.location.search);
let userId = params.get('user_id');

// If no User ID, show input box to enter one
if (!userId) {
    const profileInfo = document.getElementById('profile-info');
    profileInfo.innerHTML = `
        <div class="user-id-prompt">
            <label for="user-id-input">Enter User ID:</label>
            <input type="text" id="user-id-input" placeholder="User ID">
            <button id="load-profile-btn">Load Profile</button>
        </div>
    `;

  
