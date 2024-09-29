function loadProfile(userId) {
    console.log("Loading profile for userId:", userId);
    const profileInfo = document.getElementById('profile-info');
    const saveButton = document.getElementById('save-profile');

    if (!userId) {
        profileInfo.innerHTML = '<p>No user ID provided.</p>';
        saveButton.style.display = 'none';
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
            surname: 'fas fa-user-check',
            pronouns: 'fas fa-user-tag',
            gender: 'fas fa-venus-mars',
            email: 'fas fa-envelope',
            phone: 'fas fa-phone',
            website: 'fas fa-globe',
            GitHub: 'fab fa-github',
            GitLab: 'fab fa-gitlab',
            git: 'fab fa-git',
            StackOverflow: 'fab fa-stack-overflow',
            discord: 'fab fa-discord',
            instagram: 'fab fa-instagram',
            twitter: 'fab fa-twitter',
            facebook: 'fab fa-facebook',
            YouTube: 'fab fa-youtube'
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

        // Show the save button
        saveButton.style.display = 'block';

        // Set the click event to save the profile
        saveButton.onclick = function() {
            saveProfileAsJSON(decodedData);
        };

    } catch (error) {
        console.error('Error loading profile:', error);
        profileInfo.innerHTML = '<p>Error loading profile data. Please try again.</p>';
        saveButton.style.display = 'none'; // Hide the save button on error
    }
}

function saveProfileAsJSON(profileData) {
    const dataStr = JSON.stringify(profileData, null, 2); // Pretty print JSON
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.opr'; // Custom extension
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up
}

// Call loadProfile when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');
    loadProfile(userId);
});
