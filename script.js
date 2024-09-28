document.getElementById('profileForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

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
    const theme = document.getElementById('themeSelector').value;

    // Generate the API URL for the serverless function
    const apiUrl = `/.netlify/functions/generateCard?name=${encodeURIComponent(name)}&surname=${encodeURIComponent(surname)}&gender=${encodeURIComponent(gender)}&email=${encodeURIComponent(email)}&phonenum=${encodeURIComponent(phonenum)}&website=${encodeURIComponent(website)}&github=${encodeURIComponent(github)}&twitter=${encodeURIComponent(twitter)}&instagram=${encodeURIComponent(instagram)}&facebook=${encodeURIComponent(facebook)}&youtube=${encodeURIComponent(youtube)}&theme=${theme}`;

    // Fetch the image from the serverless function
    const response = await fetch(apiUrl);
    const imageData = await response.json();
    const imageUrl = `data:image/png;base64,${imageData.body}`;

    // Create an image element to display the OpenProfile card
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = 'OpenProfile Card';
    document.getElementById('output').innerHTML = '';
    document.getElementById('output').appendChild(imgElement);
});
