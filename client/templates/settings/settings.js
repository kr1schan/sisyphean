Template.settings.helpers({
  userEmail: function() {
    var user = Meteor.user();
    if (user) {
      return user.emails[0].address;
    } else {
      return "";
    }
  },
  userName: function() {
    var user = Meteor.user();
    if (user) {
      return user.profile.name;
    } else {
      return "";
    }
  },
  hasUserName: function() {
    var user = Meteor.user();
    return user && user.profile.name;
  }
});

Template.settings.events({
  "submit .user-settings": function(event) {
    event.preventDefault();

    var userEmail = event.target.userEmail.value;
    var userName = event.target.userName.value;
    var user = Meteor.user();

    if ((userEmail === user.emails[0].address) && (userName === user.profile.name)) {
      toast('Keine Änderungen!', 3000);
      return;
    }

    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.name": userName
      }
    });

    toast('Änderungen Übernommen!', 3000);
  }
});
