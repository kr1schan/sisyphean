Meteor.methods({
  'Tasks.insert': function (params) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Tasks.insert(params);
  }
});
