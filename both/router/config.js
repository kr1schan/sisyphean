Router.configure({
  controller: 'AppController',
  loadingTemplate: 'loading',
});

Router.onBeforeAction('loading');

Router.plugin('dataNotFound', {dataNotFoundTemplate: 'notFound'});
