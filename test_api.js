const fetch = require('node-fetch');

async function testAbout() {
    try {
        const response = await fetch('http://localhost:5000/api/about');
        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('API Error:', err.message);
    }
}

testAbout();
