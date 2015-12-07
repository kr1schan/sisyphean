Template.tasks.rendered = function() {

};

Template.task.helpers({
  isDone: function(status) {
    return status === 'done';
  },
  remaining: function() {
    return Template.instance().remaining.get();
  }
});

Template.task.created = function() {

  var self = this;
  this.remaining = new ReactiveVar(Tasks.remainingTime(this.data.status, this.data.statusChangedAt, this.data.repetition, this.data.startDate));
  this.deadline = new ReactiveVar(Tasks.computeDeadline(this.data.startDate, this.data.repetition));

  this.interval = Meteor.setInterval(function() {
    self.remaining.set(Tasks.remainingTime(self.data.status, self.data.statusChangedAt, self.data.repetition, self.data.startDate));
    self.deadline.set(Tasks.computeDeadline(self.data.startDate, self.data.repetition));
  }, 1000);
}

Template.task.events({
  "click .toggle-checked": function(event, template) {
    var newState = "done";
    var newChangedAt = new Date();

    if (this.status == "done") newState = "open";

    Tasks.update(this._id, {
      $set: {
        status: newState,
        statusChangedAt: newChangedAt
      }
    });

    template.remaining.set(Tasks.remainingTime(newState, newChangedAt, this.repetition, this.startDate));
    template.deadline.set(Tasks.deadline(this.startDate, this.repetition));
  }
});
