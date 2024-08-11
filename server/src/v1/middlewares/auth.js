const admin = require('firebase-admin');
const User = require("../models/user");
var serviceAccount = require("../config/fbServiceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ecommerce-81bc1.firebaseio.com", // Include if using Realtime Database
  });
}
exports.authCheck = async (req, res, next) => {
  // const idToken = req.header['authtoken'];
  const idToken = req.headers['authtoken'];
  if (!idToken) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Verify the token
    const firebaseUser = await admin.auth().verifyIdToken(idToken);
    req.user = firebaseUser;
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};


exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email }).exec();

  if (adminUser.role !== "admin") {
    res.status(403).json({
      err: "Admin resource. Access denied.",
    });
  } else {
    next();
  }
};
