document.getElementById('profile-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const profileData = Object.fromEntries(formData.entries());

    // Use shortened keys
    const compactData = {
        n: profileData.name,
        s: profileData.surname,
        g: profileData.gender,
        e: profileData.email,
        p: profileData.phone,
        w: profileData.website,
        gh: profileData.github,
        ig: profileData.instagram,
        tw: profileData.twitter,
        fb: profileData.facebook,
        yt: profileData.youtube
    };

    const encodedData = encodeBase62(JSON.stringify(compactData)); // Base62 encode

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h2>Generated User ID:</h2>
        <p>${encodedData}</p>
        <h3>View Profile:</h3>
        <a href="view.html?user_id=${encodedData}" target="_blank">View Profile</a>
    `;
});

// Base62 encoding function
function encodeBase62(str) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let num = BigInt('0x' + Buffer.from(str, 'utf8').toString('hex'));
    let encoded = '';
    while (num > 0) {
        encoded = chars[num % 62n] + encoded;
        num = num / 62n;
    }
    return encoded;
}
