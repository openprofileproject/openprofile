// Base62 encoding characters
const base62Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// Convert a number to Base62
function toBase62(num) {
    let result = '';
    while (num > 0) {
        result = base62Chars[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result || '0';
}

// Convert Base62 back to a number
function fromBase62(str) {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
        result = result * 62 + base62Chars.indexOf(str[i]);
    }
    return result;
}

// Convert object to a compressed Base62 string
function encodeProfileData(profileData) {
    const jsonData = JSON.stringify(profileData);
    const encodedData = new TextEncoder().encode(jsonData); // Convert JSON string to byte array
    let num = BigInt('0x' + Array.from(encodedData).map(byte => byte.toString(16).padStart(2, '0')).join('')); // Hex to BigInt
    return toBase62(num);
}

// Decode Base62 string back to profile data
function decodeProfileData(base62Str) {
    const num = fromBase62(base62Str); // Convert Base62 back to BigInt
    const hexStr = num.toString(16);
    const byteArray = new Uint8Array(hexStr.match(/.{1,2}/g).map(byte => parseInt(byte, 16))); // Hex to byte array
    const jsonData = new TextDecoder().decode(byteArray); // Convert byte array back to JSON string
    return JSON.parse(jsonData);
}

document.getElementById('profile-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const profileData = Object.fromEntries(formData.entries());
    const encodedData = encodeProfileData(profileData); // Base62 encode

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h2>Generated User ID:</h2>
        <p>${encodedData}</p>
        <h3>View Profile:</h3>
        <a href="view.html?user_id=${encodedData}" target="_blank">View Profile</a>
    `;
});
