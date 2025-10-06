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
    const formEntries = Object.fromEntries(formData.entries());
    delete formEntries['default-avatar']; // don't make it part of formEntries, since it is handled separately (i am an idiot)
    const profileData = {
        ...formEntries,
        defaultAvatar: document.getElementById('default-avatar') ? document.getElementById('default-avatar').value : '404'
    };
    const encodedData = encodeProfileData(profileData);
    const resultDiv = document.getElementById('result');
    const longUrl = `https://openprofile.is-cool.dev/view?user_id=${encodedData}`;
    const workerUrl = "https://openprofile-linkshortener.gamerselimiko.workers.dev/";
    resultDiv.innerHTML = `
        <h3>View Profile:</h3>
        <button onclick="window.location.href='${longUrl}'">View Profile</button><br>
        <h3>Create short link for your profile:</h3>
        <input id="shortenSlug" placeholder="Enter username (opr.k.vu/username)" /><br>
        <button id="shortenBtn">Create Short Link</button>
        <p id="shortenResult"></p>
    `;
    document.getElementById("shortenBtn").addEventListener("click", async () => {
      const shortenSlug = document.getElementById("shortenSlug").value.trim();
      const shortenResult = document.getElementById("shortenResult");

      // if (!longUrl) return (shortenResult.textContent = "Please enter a URL."); // this wont happen ik
      shortenResult.textContent = "Creating short link...";

      try {
        const res = await fetch(workerUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ longUrl, shortenSlug }),
        });

        const shortenData = await res.json();

        if (!res.ok) {
          shortenResult.textContent = "Error: " + (shortenData.description || shortenData.error || "Unknown error");
          return;
        }

        result.innerHTML = `Short link: <a href="${data.shortURL}" target="_blank">${data.shortURL}</a>`;
        } catch (err) {
        result.textContent = "Network error: " + err.message;
      }
    });
});
