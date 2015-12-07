AutoForm.hooks({
  'tasks-new-form': {
    onSuccess: function (operation, result, template) {
      toast('Task erfolgreich angelegt!', 4000);
      Router.go('tasks');
    }
  }
});
