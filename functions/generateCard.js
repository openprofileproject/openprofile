const { createCanvas, registerFont } = require('canvas');

// Optionally register custom fonts
// registerFont('path/to/font.ttf', { family: 'Your Font Family' });

exports.handler = async (event, context) => {
    const { 
        name, 
        surname, 
        gender, 
        email, 
        phonenum, 
        website, 
        github, 
        twitter, 
        instagram, 
        facebook, 
        youtube, 
        theme 
    } = event.queryStringParameters;

    const canvas = createCanvas(600, 300);
    const ctx = canvas.getContext('2d');

    // Set background based on theme
    switch (theme) {
        case 'dark':
            ctx.fillStyle = '#333';
            break;
        case 'light':
            ctx.fillStyle = '#fff';
            break;
        case 'github':
            ctx.fillStyle = '#24292e';
            break;
        case 'discord':
            ctx.fillStyle = '#7289da';
            break;
        case 'lgbt':
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, '#ff0000');
            gradient.addColorStop(0.14, '#ff7f00');
            gradient.addColorStop(0.28, '#ffff00');
            gradient.addColorStop(0.42, '#00ff00');
            gradient.addColorStop(0.57, '#0000ff');
            gradient.addColorStop(0.71, '#4b0082');
            gradient.addColorStop(0.85, '#9400d3');
            ctx.fillStyle = gradient;
            break;
        default:
            ctx.fillStyle = '#fff';
    }

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'; // Set text color
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';

    // Icons for each field
    const icons = {
        name: 'fa-user',
        gender: 'fa-venus-mars',
        email: 'fa-envelope',
        phonenum: 'fa-phone',
        website: 'fa-link',
        github: 'fa-github',
        twitter: 'fa-twitter',
        instagram: 'fa-instagram',
        facebook: 'fa-facebook',
        youtube: 'fa-youtube'
    };

    const lineHeight = 30; // Space between lines
    let yPosition = 50; // Initial y position

    // Function to draw icon and text
    const drawIconWithText = (icon, text) => {
        ctx.font = '20px FontAwesome'; // Use FontAwesome font
        ctx.fillText(String.fromCharCode(0xf007), 50, yPosition); // User icon
        ctx.font = '20px Arial'; // Switch back to Arial for text
        ctx.fillText(text, 80, yPosition); // Adjust position after the icon
    };

    // Drawing fields with icons
    drawIconWithText(icons.name, `${name} ${surname}`);
    yPosition += lineHeight;
    drawIconWithText(icons.gender, gender);
    yPosition += lineHeight;
    drawIconWithText(icons.email, email);
    yPosition += lineHeight;
    drawIconWithText(icons.phonenum, phonenum);
    yPosition += lineHeight;
    drawIconWithText(icons.website, website);
    yPosition += lineHeight;
    drawIconWithText(icons.github, github);
    yPosition += lineHeight;
    drawIconWithText(icons.twitter, twitter);
    yPosition += lineHeight;
    drawIconWithText(icons.instagram, instagram);
    yPosition += lineHeight;
    drawIconWithText(icons.facebook, facebook);
    yPosition += lineHeight;
    drawIconWithText(icons.youtube, youtube);
    yPosition += lineHeight;

    const buffer = canvas.toBuffer();
    
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'image/png',
        },
        body: buffer.toString('base64'),
        isBase64Encoded: true,
    };
};
