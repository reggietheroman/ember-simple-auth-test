import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

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
