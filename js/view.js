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
            const defaultAvatar = decodedData.DefaultAvatar || 'retro'; // not defaultAvatar, DefaultAvatar because it automatically capitalizes the first letter
            const validAvatars = ['identicon', 'retro', 'mm', 'pagan', 'monsterid', 'robohash', '404'];
            const avatarType = validAvatars.includes(defaultAvatar) ? defaultAvatar : 'retro';
            const avatarUrl = `https://seccdn.libravatar.org/avatar/${emailHash}?s=200&default=${avatarType}`;

            const img = new Image();
            img.src = avatarUrl;
            img.onload = function() {
                img.alt = 'Profile Avatar';
                img.className = 'profile-avatar';
                // Insert the avatar at the beginning of profileInfo
                profileInfo.insertBefore(img, profileInfo.firstChild);
            };
            img.onerror = function() {
                console.log("No Libravatar found for this email.");
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
                const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
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


// Load SparkMD5 for hashing the email
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