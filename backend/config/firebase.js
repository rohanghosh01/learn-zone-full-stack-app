const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const configJson = require("../config/config.json");
const config = require("../config/config.json")[configJson.ENVIRONMENT];
let serviceAccount = config.FIREBASE_CONFIG;
let bucketName = config.BUCKET_NAME;
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  storageBucket: bucketName,
};

const app = admin.initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore;

module.exports = { db, auth, admin };
