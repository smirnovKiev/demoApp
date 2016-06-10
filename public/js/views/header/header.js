'use strict';

define([
    'backbone',
    'underscore',
    'backendless',
    'text!templates/header/header.html'
], function (Backbone, _, Backendless, headerTemplate) {

     return Backbone.View.extend({
        el      : "#header",
        template: _.template(headerTemplate),

        initialize: function () {
            this.render();
         },

         events: {
             'click #logout-link': 'onLogout'
         },

         onLogout: function (e) {
             e.preventDefault();

             Backendless.UserService.logout()
                 .then(function () {
                     $('#headerContent').slideUp(function () {
                         APP.loggedIn = false;
                         APP.successNotification('You have successfully logged out');
                         Backbone.history.navigate('#app/login', { trigger: true });
                     });
                 })
                 .catch(function (err) {
                     APP.handleError(err);
                 })
         },

         render: function () {
            this.$el.html(this.template());

            return this;
         }
    });
});


