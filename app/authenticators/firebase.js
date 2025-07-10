import Base from 'ember-simple-auth/authenticators/base';
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'ember-simple-auth-test/utils/firebase';
import { tracked } from '@glimmer/tracking';

export default class FirebaseAuthenticator extends Base {
  @tracked user = null;

  authenticate() {
    return new Promise(async (resolve, reject) => {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const token = await result.user.getIdToken();
        this.user = result.user;
        resolve({ token, user: result.user });
      } catch (error) {
        reject(error);
      }
    });
  }

  restore(data) {
    return new Promise(async (resolve, reject) => {
      try {
        if (data?.token && data?.user) {
          this.user = data.user;
          const token = data.token;
          resolve({ token, user: this.user });
        } else {
          reject('Invalid session');
        }
      } catch (error) {
        console.log('rejecting session error: ', error);
        reject(`Invalid session ${error}`);
      }
    });
  }

  async invalidate() {
    await auth.signOut();
    this.user = null;
  }
}
