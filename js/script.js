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

document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profile-form');
    const shortenButton = document.getElementById('shorten-link');
    const shortenedLinkDiv = document.getElementById('shortened-link');

    // Handle profile form submission (if you need to process the profile generation)
    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Process form data and generate the long URL
        const formData = new FormData(profileForm);
        const queryParams = new URLSearchParams(formData).toString();
        const longUrl = `https://openprofile.us.to/view?${queryParams}`;
        
        document.getElementById('result').innerText = `Generated Profile URL: ${longUrl}`;
    });

    // Shorten link on button click
    shortenButton.addEventListener('click', async function() {
        const resultDiv = document.getElementById('result');
        const longUrl = resultDiv.innerText.split('Generated Profile URL: ')[1];
        
        if (!longUrl) {
            shortenedLinkDiv.innerHTML = '<p>Please generate a profile link first.</p>';
            return;
        }

        const shortUrl = await createShortLink(longUrl); // Call function to shorten the link
        shortenedLinkDiv.innerHTML = `Shortened URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
    });

    // Short.io API integration for creating short links
    async function createShortLink(longUrl) {
        const apiKey = 'pk_3kyuBD0Af5Pz0ZNI';  // Replace with your Short.io API key
        const domain = 'opr.ix.tc';   // Replace with your Short.io domain (e.g., "example.shrt.io")
        
        try {
            const response = await fetch('https://api.short.io/links', {
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
                throw new Error('Error creating short link');
            }

            const result = await response.json();
            return result.shortURL;  // Return the shortened URL
        } catch (error) {
            console.error(error);
            shortenedLinkDiv.innerHTML = '<p>Error generating shortened URL. Please try again.</p>';
        }
    }
});

document.getElementById('profile-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const profileData = Object.fromEntries(formData.entries());
    const encodedData = encodeProfileData(profileData);
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h2>Generated User ID:</h2>
        <p>${encodedData}</p>
        <h3>View Profile:</h3>
        <a href="view.html?user_id=${encodedData}" target="_blank">View Profile</a>
    `;
});
