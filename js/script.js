// Base62 encoding characters
const base62Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// Convert a BigInt to Base62
function toBase62(num) {
    if (num === 0n) return '0';
    let result = '';
    while (num > 0n) {
        result = base62Chars[Number(num % 62n)] + result;
        num = num / 62n;
    }
    return result;
}

// Convert Base62 back to a BigInt
function fromBase62(str) {
    let result = 0n;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const value = base62Chars.indexOf(char);
        if (value === -1) {
            throw new Error(`Invalid Base62 character: ${char}`);
        }
        result = result * 62n + BigInt(value);
    }
    return result;
}

// Convert object to a compressed Base62 string
function encodeProfileData(profileData) {
    const jsonData = JSON.stringify(profileData);
    const encodedData = new TextEncoder().encode(jsonData);
    const num = BigInt('0x' + Array.from(encodedData).map(byte => byte.toString(16).padStart(2, '0')).join(''));
    return toBase62(num);
}

// Decode Base62 string back to profile data
function decodeProfileData(base62Str) {
    const num = fromBase62(base62Str);
    const hexStr = num.toString(16).padStart(2, '0');
    const byteArray = new Uint8Array(hexStr.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const jsonData = new TextDecoder().decode(byteArray);
    return JSON.parse(jsonData);
}

document.getElementById('profile-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const profileData = Object.fromEntries(formData.entries());
    const encodedData = encodeProfileData(profileData);
    const resultDiv = document.getElementById('result');
    const longUrl = `https://openprofile.is-cool.dev/view?user_id=${encodedData}`;

    resultDiv.innerHTML = `
        <h2>Generated User ID:</h2>
        <p>${encodedData}</p>
        <h3>View Profile:</h3>
        <button onclick="window.location.href='${longUrl}'">View Profile</button>
        <a href="https://docs.sctech.localplayer.dev/openprofile/for-everyone/openprofile+">Become an OpenProfile+ member!</a>
    `;
});
