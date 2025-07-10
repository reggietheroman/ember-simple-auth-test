import EmberRouter from '@ember/routing/router';
import config from 'ember-simple-auth-test/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('protected');
  this.route('public');
  this.route('public-any');
});
