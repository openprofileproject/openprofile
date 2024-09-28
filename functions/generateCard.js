const { createCanvas, registerFont } = require('canvas');
const path = require('path');

// Register fonts
registerFont(path.join(__dirname, 'fonts', 'fa-solid-900.ttf'), { family: 'FontAwesome' });
registerFont(path.join(__dirname, 'fonts', 'Arial.ttf'), { family: 'Arial' });

exports.handler = async function (event, context) {
    const queryParams = event.queryStringParameters;

    const name = queryParams.name || 'No Name';
    const surname = queryParams.surname || '';
    const gender = queryParams.gender || '';
    const email = queryParams.email || '';
    const phonenum = queryParams.phonenum || '';
    const website = queryParams.website || '';
    const github = queryParams.github || '';
    const twitter = queryParams.twitter || '';
    const instagram = queryParams.instagram || '';
    const facebook = queryParams.facebook || '';
    const youtube = queryParams.youtube || '';
    const theme = queryParams.theme || 'light';

    // Canvas dimensions
    const width = 800;
    const height = 400;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    // Define themes
    const themes = {
        light: { background: '#ffffff', text: '#000000' },
        dark: { background: '#333333', text: '#ffffff' },
        github: { background: '#24292f', text: '#ffffff' },
        discord: { background: '#7289da', text: '#ffffff' },
        lgbt: { background: '#ff69b4', text: '#ffffff' }
    };

    const selectedTheme = themes[theme] || themes.light;

    // Fill background
    context.fillStyle = selectedTheme.background;
    context.fillRect(0, 0, width, height);

    // Text color
    context.fillStyle = selectedTheme.text;
    context.font = 'bold 36px Arial';

    // Draw user name and surname
    context.fillText(`${name} ${surname}`, 50, 60);

    // Use FontAwesome for icons
    context.font = '24px FontAwesome';
    context.fillText('\uf182', 50, 110); // Gender icon
    context.fillText('\uf0e0', 50, 150); // Email icon
    context.fillText('\uf095', 50, 190); // Phone icon
    context.fillText('\uf0ac', 50, 230); // Website icon
    context.fillText('\uf09b', 50, 270); // GitHub icon
    context.fillText('\uf099', 50, 310); // Twitter icon
    context.fillText('\uf16d', 50, 350); // Instagram icon
    context.fillText('\uf09a', 50, 390); // Facebook icon
    context.fillText('\uf167', 50, 430); // YouTube icon

    // Draw text values
    context.font = '24px Arial';
    context.fillText(gender, 80, 110);
    context.fillText(email, 80, 150);
    context.fillText(phonenum, 80, 190);
    context.fillText(website, 80, 230);
    context.fillText(github, 80, 270);
    context.fillText(twitter, 80, 310);
    context.fillText(instagram, 80, 350);
    context.fillText(facebook, 80, 390);
    context.fillText(youtube, 80, 430);

    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/png');

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'image/png',
            'Access-Control-Allow-Origin': '*', // Allow CORS
        },
        body: buffer.toString('base64'),
        isBase64Encoded: true,
    };
};

