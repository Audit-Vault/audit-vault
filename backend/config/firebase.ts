import admin, { ServiceAccount } from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

const serviceAccount = JSON.parse(serviceAccountJson!) as ServiceAccount;

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

export default admin;
