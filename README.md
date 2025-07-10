# ember-simple-auth-test

Quick project to show use of [Ember simple auth](https://github.com/mainmatter/ember-simple-auth) inside an [Ember.js v6.5](https://emberjs.com/) application.

This test was done using ember-simple-auth [version 8.0.0](https://github.com/mainmatter/ember-simple-auth/tree/v8.0.0-ember-simple-auth) and ember.js version 6.5.

## Steps to setup from scratch

### 1. Install ember-simple-auth
```cli
ember install ember-simple-auth
```

### 2. Create a session service
```app/services/session.js
import Service from 'ember-simple-auth/services/session';

export default class SessionService extends Service {}
```

### 3. Create a session store
```app/session-stores/application.js
import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';

export default class SessionStore extends AdaptiveStore {}
```

### 4. IF not using any of the available authenticators, CREATE A CUSTOM AUTHENTICATOR. This should go in `app/authenticators`. 

### 5. In this test, I used firebase so this file is firebase specific.
```app/authenticators/firebase.js
import Base from 'ember-simple-auth/authenticators/base';
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'ember-simple-auth-test-2/utils/firebase';
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
```

### 6. Firebase utility file to load up and configure firebase in the app. Create an `app/utils` directory for this.
*You can skip this if you did NOT create a custom authenticator for Google firebase.*
```app/utils/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // DO NOT COMMIT
  authDomain: "YOU_AUTH_DOMAIN", // DO NOT COMMIT
  projectId: "YOUR_PROJECT_ID", // DO NOT COMMIT
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, GoogleAuthProvider, signInWithPopup };
```

### 7. IF file not found, create a `app/routes/application` file (app/routes/application.js or app/routes/application.ts)

### 8. In the the routes/application file, create an implementation of the routes `[beforeModel](https://api.emberjs.com/ember/6.5/classes/Route/methods/beforeModel?anchor=beforeModel)` method.

### 9. In the `beforeModel()` method, import the session service and await the [session.setup](https://ember-simple-auth.com/api/SessionService.html#.setup) method.
```app/routes/application.js
import { service } from '@ember/service';
import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
  @service session;

  async beforeModel() {
    await this.session.setup();
  }
}
```
### 10. IF file not found, create a `app/controllers/application` file (app/controllers/application.js or app/controllers/application.ts)

### 11. Create actions for login and logout using the firebase authenticator created earlier (or your custom authenticator)
```app/controllers/application.js
import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  @service session;

  @action
  async login() {
    try {
      await this.session.authenticate('authenticator:firebase');
    } catch (e) {
      console.error('Authentication error: ', e);
    }
  }

  @action
  logout() {
    this.session.invalidate();
  }
}
```

### 12. Update the `app/templates/application.hbs` file by adding a conditional that shows either a log in button or a log out button button depending on whether the session is authenticated or not.

### 13. You should now be able to run using `ember s` or `npm start`
```cli
$ ember s
```
or
```cli
$ npm start
```

### 14. Test the app by opening your browser and going to [http://localhost:4200](http://localhost:4200)
