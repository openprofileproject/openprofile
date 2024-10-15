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
            surname: 'fas fa-user-check',
            bio: 'fas fa-book',
            pronouns: 'fas fa-user-tag',
            gender: 'fas fa-venus-mars',
            email: 'fas fa-envelope',
            phone: 'fas fa-phone',
            website: 'fas fa-globe',
            GPG: 'fas fa-key',
            GitHub: 'fab fa-github',
            GitLab: 'fab fa-gitlab',
            git: 'fab fa-git',
            StackOverflow: 'fab fa-stack-overflow',
            keyoxide: 'fas fa-key',
            discord: 'fab fa-discord',
            instagram: 'fab fa-instagram',
            twitter: 'fab fa-twitter',
            facebook: 'fab fa-facebook',
            YouTube: 'fab fa-youtube',
            LinkTag: 'fas fa-tag'
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

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');

    if (userId) {
        loadProfile(userId);
    } else {
        document.getElementById('profile-info').innerHTML = '<p>No user ID provided.</p>';
    }

    // Load profile from file
    document.getElementById('load-file').addEventListener('click', function() {
        document.getElementById('file-input').click();
    });

    document.getElementById('file-input').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    const encodedData = encodeProfileData(jsonData);
                    loadProfile(encodedData);
                } catch (error) {
                    console.error('Error loading file:', error);
                    document.getElementById('profile-info').innerHTML = '<p>Error loading profile from file. Please try again.</p>';
                }
            };
            reader.readAsText(file);
        }
    });

    // Save profile as .opr file
    document.getElementById('save-file').addEventListener('click', function() {
        const userId = new URLSearchParams(window.location.search).get('user_id');
        if (!userId) {
            alert('No profile loaded to save.');
            return;
        }

        const decodedData = decodeProfileData(userId);
        const jsonData = JSON.stringify(decodedData, null, 2); // Pretty print JSON
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'openprofile.opr';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL
    });
});
