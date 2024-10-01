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

// Function to generate short link using short.io API
async function generateShortLink(longUrl) {
    const apiKey = 'pk_3kyuBD0Af5Pz0ZNI';
    const domain = 'opr.ix.tc';

    try {
        const response = await fetch(`https://api.short.io/links/public`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            },
            body: JSON.stringify({
                domain: domain,
                originalURL: longUrl
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate short link');
        }

        const data = await response.json();
        return data.shortURL;
    } catch (error) {
        console.error('Error generating short link:', error);
        return null;
    }
}

document.getElementById('profile-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const profileData = Object.fromEntries(formData.entries());
    const encodedData = encodeProfileData(profileData);
    const resultDiv = document.getElementById('result');
    const longUrl = `https://openprofile.us.to/view?user_id=${encodedData}`;

    resultDiv.innerHTML = `
        <h2>Generated User ID:</h2>
        <p>${encodedData}</p>
        <h3>View Profile:</h3>
        <button onclick="window.location.href='${longUrl}'">View Profile</button>
        <button id="generate-short-link">Generate Short Link<br></button>
        <a href="https://sctech.gitbook.io/openprofile">Learn how to get a custom short URL!</a>
    `;

    document.getElementById('generate-short-link').addEventListener('click', async function() {
        this.disabled = true;
        this.textContent = 'Generating...';
        
        const shortUrl = await generateShortLink(longUrl);
        
        if (shortUrl) {
            resultDiv.innerHTML += `
                <h3>Short Link:</h3>
                <a href="${shortUrl}" target="_blank">${shortUrl}</a>
            `;
        } else {
            resultDiv.innerHTML += `
                <p>Failed to generate short link. Please try again later.</p>
            `;
        }

        this.remove();
    });
});
