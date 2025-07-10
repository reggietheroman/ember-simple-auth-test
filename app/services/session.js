import Service from 'ember-simple-auth/services/session';

export default class SessionService extends Service {
  handleAuthentication() {
    super.handleAuthentication('protected');
  }

  handleInvalidation() {
    super.handleAuthentication('application');
  }
}
