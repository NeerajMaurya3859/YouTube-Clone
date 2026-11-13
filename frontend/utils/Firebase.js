
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "you-tube-clone-six-nu.vercel.app",
  projectId: "clonelogin-24913",
  storageBucket: "clonelogin-24913.firebasestorage.app",
  messagingSenderId: "64209830741",
  appId: "1:64209830741:web:15ad1e2f3dc216a09ee5dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth =getAuth(app)
console.log("firebase config:",firebaseConfig)
console.log("firebase auth",auth)
const provider =new GoogleAuthProvider()

provider.setCustomParameters({
  prompt:"select_account"
});
export {auth,provider}