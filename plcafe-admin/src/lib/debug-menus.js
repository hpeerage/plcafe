const admin = require('firebase-admin');

// Using placeholder project ID for consistency
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

const app = admin.initializeApp({
  projectId: "plcafe-placeholder"
});
const db = admin.firestore();

async function checkMenus() {
  const snapshot = await db.collection('menus').get();
  console.log(`Found ${snapshot.size} menus`);
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
}

checkMenus();
