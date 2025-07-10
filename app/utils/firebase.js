// file to initialize and configure firebase
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "", // DO NOT COMMIT
  authDomain: "", // DO NOT COMMIT
  projectId: "", // DO NOT COMMIT
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, GoogleAuthProvider, signInWithPopup };
