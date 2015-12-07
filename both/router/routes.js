Router.route('/', {
  name: 'home'
});

Router.route('/tasks', {
  name: 'tasks',
  controller: 'TasksController'
});

Router.route('/tasks/new', {
  name: 'tasks.new'
});

Router.plugin('ensureSignedIn', {
  only: ['dashboard']
});

Router.route('/privacy', {
  name: 'privacy'
});

Router.route('/siteNotice', {
  name: 'siteNotice'
});

Router.route('/disclaimer', {
  name: 'disclaimer'
});

Router.route('/settings', {
  name: 'settings'
});
