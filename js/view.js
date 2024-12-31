function md5(email) {
    return SparkMD5.hash(email.trim().toLowerCase());
}

function loadProfile(userId) {
    console.log("Loading profile for userId:", userId);
    const profileInfo = document.getElementById('profile-info');

    if (!userId) {
        profileInfo.innerHTML = '<p>No user ID provided.</p>';
        return;
    }

    try {
        const decodedData = decodeProfileData(userId);
        console.log("Decoded data:", decodedData);

        if (typeof decodedData !== 'object' || decodedData === null) {
            throw new Error('Decoded data is not an object');
        }

        profileInfo.innerHTML = ''; // Clear any previous profile data

        // Create a container for all profile items
        const profileItemsContainer = document.createElement('div');
        profileItemsContainer.className = 'profile-items-container';

        const email = decodedData.email;
        if (email) {
            console.log("Email:", email);
            const emailHash = md5(email);
            console.log("Email hash:", emailHash);
            const defaultAvatar = decodedData.defaultAvatar || '404';
            const validAvatars = ['identicon', 'retro', 'mm', 'pagan', 'monsterid', 'robohash', '404'];
            const avatarType = validAvatars.includes(defaultAvatar) ? defaultAvatar : 'retro';
            const avatarUrl = `https://seccdn.libravatar.org/avatar/${emailHash}?s=200&default=${avatarType}`;

            const img = new Image();
            img.src = avatarUrl;
            img.alt = 'Profile Avatar';
            img.className = 'profile-avatar';
            img.onload = function() {
                // Insert the avatar at the beginning of profileInfo
                profileInfo.insertBefore(img, profileInfo.firstChild);
            };
            img.onerror = function() { // img.onerror should be our 404 case
                console.log("No Libravatar found for this email. (404)");
                if (img.parentNode) {
                    img.parentNode.removeChild(img);
                }
            };
        } else {
            console.log("No email found, skipping Libravatar.");
        }

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
            linkedin: 'fab fa-linkedin',
            instagram: 'fab fa-instagram',
            twitter: 'fab fa-twitter',
            facebook: 'fab fa-facebook',
            YouTube: 'fab fa-youtube',
            LinkTag: 'fas fa-tag'
        };

        for (const [key, value] of Object.entries(decodedData)) {
            if (key !== 'defaultAvatar' && value && typeof value === 'string') {
            const iconClass = iconMap[key] || 'fas fa-info-circle';
                const div = document.createElement('div');
                div.className = 'profile-item';
                
                const icon = document.createElement('i');
                icon.className = iconClass;
                div.appendChild(icon);
                
                const span = document.createElement('span');
                const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1); // i have a feeling this was a major mistake
                span.textContent = `${capitalizedKey}: ${value}`;
                div.appendChild(span);
                
                profileItemsContainer.appendChild(div);
            }
        }

        // Add the profile items container after any existing content (avatar)
        profileInfo.appendChild(profileItemsContainer);

        if (profileItemsContainer.children.length === 0 && !email) {
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
    const isBadge = urlParams.get('plus');

    if (userId) {
        loadProfile(userId);
    } else {
        document.getElementById('profile-info').innerHTML = '<p>No user ID provided.</p>';
    }

    if (isBadge === "true") {
        document.getElementById('badge-container').innerHTML = '<img onclick="window.location.href=\'https://openprofile.is-cool.dev/openprofileplus-verify-db.txt\'" src="https://img.shields.io/badge/OpenProfile+-This%20user%20is%20an%20OpenProfile+%20member.%20(click%20to%20verify)-gold" alt="OpenProfile+ Badge">';
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

    // Save profile as .json file
    document.getElementById('save-file').addEventListener('click', function() {
        const userId = new URLSearchParams(window.location.search).get('user_id');
        if (!userId) {
            alert('No profile loaded to save.');
            return;
        }

        const decodedData = decodeProfileData(userId);
        const jsonData = JSON.stringify(decodedData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'openprofile.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL
    });
});


// congrats if you made this far
// little easter egg from the devs :)