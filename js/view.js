const params = new URLSearchParams(window.location.search);
const userId = params.get('user_id');

if (userId) {
    const decodedData = JSON.parse(decodeBase62(userId)); // Base62 decode
    const profileInfo = document.getElementById('profile-info');

    // Mapping for shortened keys
    const keyMap = {
        n: 'Name',
        s: 'Surname',
        g: 'Gender',
        e: 'Email',
        p: 'Phone',
        w: 'Website',
        gh: 'GitHub',
        ig: 'Instagram',
        tw: 'Twitter',
        fb: 'Facebook',
        yt: 'YouTube'
    };

    for (const [key, value] of Object.entries(decodedData)) {
        const iconClass = {
            n: 'fas fa-user',
            s: 'fas fa-user-tag',
            g: 'fas fa-venus-mars',
            e: 'fas fa-envelope',
            p: 'fas fa-phone',
            w: 'fas fa-globe',
            gh: 'fab fa-github',
            ig: 'fab fa-instagram',
            tw: 'fab fa-twitter',
            fb: 'fab fa-facebook',
            yt: 'fab fa-youtube'
        }[key];

        if (value) {
            profileInfo.innerHTML += `
                <div class="profile-item">
                    <i class="${iconClass}"></i>
                    <span>${keyMap[key]}: ${value}</span>
                </div>
            `;
        }
    }
} else {
    document.getElementById('profile-info').innerHTML = '<p>No user ID provided.</p>';
}

// Base62 decoding function
function decodeBase62(str) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let num = BigInt(0);
    for (let char of str) {
        num = num * 62n + BigInt(chars.indexOf(char));
    }
    return Buffer.from(num.toString(16), 'hex').toString('utf8');
}
