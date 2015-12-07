Meteor.publishComposite("tasks", function() {
  return {
    find: function() {
      return Tasks.find({
        owner: this.userId
      });
    }
  }
});
