document.getElementById('profileForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const gender = document.getElementById('gender').value;
    const email = document.getElementById('email').value;
    const phonenum = document.getElementById('phonenum').value;
    const website = document.getElementById('website').value;
    const github = document.getElementById('github').value;
    const twitter = document.getElementById('twitter').value;
    const instagram = document.getElementById('instagram').value;
    const facebook = document.getElementById('facebook').value;
    const youtube = document.getElementById('youtube').value;
    const theme = document.getElementById('theme').value;

    const baseUrl = 'https://generate.openprofile.us.to/api';
    const urlParams = `?name=${encodeURIComponent(name)}&surname=${encodeURIComponent(surname)}&gender=${encodeURIComponent(gender)}&email=${encodeURIComponent(email)}&phonenum=${encodeURIComponent(phonenum)}&website=${encodeURIComponent(website)}&github=${encodeURIComponent(github)}&twitter=${encodeURIComponent(twitter)}&instagram=${encodeURIComponent(instagram)}&facebook=${encodeURIComponent(facebook)}&youtube=${encodeURIComponent(youtube)}&theme=${encodeURIComponent(theme)}`;

    const apiUrl = `${baseUrl}${urlParams}`;
    const markdownLink = `![OpenProfile Card](${apiUrl})`;
    const htmlLink = `<img src="${apiUrl}" alt="OpenProfile Card">`;
    const bbcodeLink = `[img]${apiUrl}[/img]`;

    document.getElementById('generatedLinks').innerHTML = `
        <p><strong>API URL:</strong> <a href="${apiUrl}" target="_blank">${apiUrl}</a></p>
        <p><strong>Markdown:</strong> <code>${markdownLink}</code></p>
        <p><strong>HTML:</strong> <code>${htmlLink}</code></p>
        <p><strong>BBCode:</strong> <code>${bbcodeLink}</code></p>
    `;
});
