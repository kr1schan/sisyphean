TasksController = AppController.extend({
  waitOn: function() {
    return this.subscribe('tasks');
  },
  data: {
    tasks: Tasks.find({})
  },
  onAfterAction: function () {
    Meta.setTitle('Tasks');
  }
});

TasksController.events({
  'click [data-action=doSomething]': function (event, template) {
    event.preventDefault();
  }
});
