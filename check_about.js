const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('./firebase-config.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkAbout() {
    const snapshot = await db.collection('about').get();
    if (snapshot.empty) {
        console.log('About collection is empty');
    } else {
        snapshot.forEach(doc => {
            console.log('Document ID:', doc.id);
            console.log('Data:', JSON.stringify(doc.data(), null, 2));
        });
    }
    process.exit(0);
}

checkAbout().catch(err => {
    console.error(err);
    process.exit(1);
});
