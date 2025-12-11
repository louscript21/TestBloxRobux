import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    databaseURL: "https://bloxrobux-e9244-default-rtdb.europe-west1.firebasedatabase.app"
  });
}

const db = admin.database();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  
  const { userId, currencyAmount } = req.body;
  const userRef = db.ref("users/" + userId + "/balance");
  const snapshot = await userRef.get();
  const current = snapshot.exists() ? snapshot.val() : 0;
  await userRef.set(current + Number(currencyAmount));

  res.status(200).json({ success: true });
}
