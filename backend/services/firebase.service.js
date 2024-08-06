const { auth } = require("../config/firebase");
const firebaseService = {
  verifyToken: async (token) => {
    try {
      const decoded = await auth.verifyIdToken(token);
      return decoded;
    } catch (error) {
      console.log("error in firebase login service ", error);
      return false;
    }
  },
};

module.exports = firebaseService;
