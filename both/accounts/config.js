AccountsTemplates.configureRoute('signIn', {layoutTemplate: 'appLayout'});
AccountsTemplates.configureRoute('signUp', {layoutTemplate: 'appLayout'});
AccountsTemplates.configureRoute('ensureSignedIn', {layoutTemplate: 'appLayout'});


AccountsTemplates.configure({
  enablePasswordChange: true,
  sendVerificationEmail: false,
  privacyUrl: 'privacy'
});

AccountsTemplates.addField({
  _id: 'username',
  type: 'text',
  displayName: 'Name',
  required: true
});

AccountsTemplates.addField({
  _id: 'groupId',
  type: 'text',
  displayName: 'Gruppen Token'
});



T9n.setLanguage('de');
