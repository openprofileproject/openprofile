document.getElementById('profileForm').addEventListener('submit', function (e) {
    e.preventDefault();

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

    const apiUrl = `https://generate.openprofile.us.to/api?name=${encodeURIComponent(name)}&surname=${encodeURIComponent(surname)}&gender=${encodeURIComponent(gender)}&email=${encodeURIComponent(email)}&phonenum=${encodeURIComponent(phonenum)}&website=${encodeURIComponent(website)}&github=${encodeURIComponent(github)}&twitter=${encodeURIComponent(twitter)}&instagram=${encodeURIComponent(instagram)}&facebook=${encodeURIComponent(facebook)}&youtube=${encodeURIComponent(youtube)}&theme=${encodeURIComponent(theme)}`;

    document.getElementById('profileCard').src = apiUrl;

    const markdownLink = `![OpenProfile]( ${apiUrl} )`;
    const htmlLink = `<img src="${apiUrl}" alt="OpenProfile">`;
    const bbcodeLink = `[img]${apiUrl}[/img]`;

    document.getElementById('markdown').innerText = `Markdown: ${markdownLink}`;
    document.getElementById('html').innerText = `HTML: ${htmlLink}`;
    document.getElementById('bbcode').innerText = `BBCode: ${bbcodeLink}`;
});
