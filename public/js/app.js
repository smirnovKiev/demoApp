'use strict';

define([
    'router',
    'backbone',
    'messenger',
    'underscore',
    'backendless',
    'views/header/header'
], function (Router, Backbone, messenger, _, Backendless, HeaderView) {

    function init() {
        Backendless.UserService.getCurrentUser()
            .then(function (user) {
                var url;

                APP.channel = _.extend({ }, Backbone.Events);
                APP.router = new Router({channel : APP.channel});

                Backbone.history.start({silent: true});

                user ? APP.loggedIn = true : APP.loggedIn = false;

                url = Backbone.history.fragment = '' || 'home';

                new HeaderView();
                
                var $header = $('#header');

                APP.loggedIn ? $header.slideDown() : url = '#app/login';

                Backbone.history.navigate(url, { trigger: true });
            })
            .catch(function (err) {
                APP.handleError(err);
            });

        APP.navigate = function(url) {
            Backbone.history.navigate(url, { trigger: true });
        };

        APP.successNotification = function(message) {
            messenger.alert('success', message);
        };

        APP.warningNotification = function(message) {
            messenger.alert('warning', message);
        };

        APP.handleError = function(err) {
            messenger.alert('error', err.message);
        };
    }

    return {
        initialize: init
    }
});