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
                    APP.successNotification('You have successfully logged out');

                    APP.authorized = false;
                    APP.userId = null;
                    Backbone.history.navigate('#app/home', {trigger: true});
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


