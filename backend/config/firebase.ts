import admin, { ServiceAccount } from "firebase-admin";

admin.initializeApp({
	credential: admin.credential.cert(
		JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!) as ServiceAccount
	)
});

export default admin;
