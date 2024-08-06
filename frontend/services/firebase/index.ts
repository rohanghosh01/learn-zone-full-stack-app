import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import config from "../../config/config.json";
import { auth, googleProvider, currentUser } from "./config";
const defaultImage = config.DEFAULT_PROFILE;
export async function googleLogin() {
  return signInWithPopup(auth, googleProvider)
    .then(async (result) => {
      // // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      let token = await getToken();
      let user = {
        uid: result.user.uid,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        email: result.user.email,
      };
      return { token, user };
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

export async function emailLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    let token = await getToken(); // Getting the access token
    let user = {
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      uid: result.user.uid,
    };
    return { token, user };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function emailSignup({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, {
      displayName: name,
      photoURL: defaultImage,
    });
    let token = await getToken(); // Getting the access token
    let user = {
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      uid: result.user.uid,
    };
    return { token, user };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function upload(file: File, path?: any) {
  const storage = getStorage();

  let folder = path || "users";

  // Create a reference to the storage service, and then create a child reference
  // with the name of the file
  let fileName = Date.now();
  const storageRef = ref(storage, `${folder}/${fileName}`);

  try {
    // Create a new upload task with the file metadata and upload the file
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Set up the progress event to monitor the upload progress
    uploadTask.on("state_changed", (snapshot) => {
      // Handle progress
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Upload is ${progress}% done`);
    });

    // Wait for the upload task to complete
    await uploadTask;

    // Once the upload is complete, get the download URL
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    return downloadURL || null;
  } catch (error: any) {
    console.error("firebase Upload failed:", error);
    throw new Error(error);
  }
}

async function getToken() {
  try {
    let token = auth.currentUser?.getIdToken(/* forceRefresh */ true);
    return token;
  } catch (error) {
    console.log("error getting token", error);
    return null;
  }
}
