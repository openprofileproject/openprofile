function loadProfile(userId) {
    console.log("Loading profile for userId:", userId);
    const profileInfo = document.getElementById('profile-info');
    
    if (!userId) {
        profileInfo.innerHTML = '<p>No user ID provided.</p>';
        return;
    }

    try {
        const decodedData = decodeProfileData(userId); // Base62 decode
        console.log("Decoded data:", decodedData);

        if (typeof decodedData !== 'object' || decodedData === null) {
            throw new Error('Decoded data is not an object');
        }

        profileInfo.innerHTML = ''; // Clear any previous profile data

        const iconMap = {
            name: 'fas fa-user',
            surname: 'fas fa-user-tag',
            pronouns: 'fas fa-user-check',
            gender: 'fas fa-venus-mars',
            email: 'fas fa-envelope',
            phone: 'fas fa-phone',
            website: 'fas fa-globe',
            github: 'fab fa-github',
            gitlab: 'fab fa-gitlab',
            git: 'fab fa-git',
            stackoverflow: 'fab fa-stack-overflow',
            discord: 'fab fa-discord',
            instagram: 'fab fa-instagram',
            twitter: 'fab fa-twitter',
            facebook: 'fab fa-facebook',
            youtube: 'fab fa-youtube'
        };

        for (const [key, value] of Object.entries(decodedData)) {
            if (value && typeof value === 'string') {
                const iconClass = iconMap[key] || 'fas fa-info-circle'; // Default icon
                const div = document.createElement('div');
                div.className = 'profile-item';
                
                const icon = document.createElement('i');
                icon.className = iconClass;
                div.appendChild(icon);

                const span = document.createElement('span');
                const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
                span.textContent = `${capitalizedKey}: ${value}`;
                div.appendChild(span);

                profileInfo.appendChild(div);
            }
        }

        if (profileInfo.children.length === 0) {
            profileInfo.innerHTML = '<p>No valid profile data found.</p>';
        }

    } catch (error) {
        console.error('Error loading profile:', error);
        profileInfo.innerHTML = '<p>Error loading profile data. Please try again.</p>';
    }
}

// Call loadProfile when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');
    loadProfile(userId);
});
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');
    if (userId) {
        loadProfile(userId);
    } else {
        document.getElementById('profile-info').innerHTML = '<p>No user ID provided.</p>';
    }
});
