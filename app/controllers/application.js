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
