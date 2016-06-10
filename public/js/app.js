'use strict';

define([
    'router',
    'backbone',
    'messenger',
    'underscore',
    'backendless',
    'views/header/header'
], function (Router, Backbone, messenger, _, Backendless, HeaderView) {

    function initialize() {

        APP.navigate = function (url) {
            Backbone.history.navigate(url, {trigger: true});
        };

        APP.successNotification = function (message) {
            messenger.alert('success', message);
        };

        APP.warningNotification = function (message) {
            messenger.alert('warning', message);
        };

        APP.handleError = function (err) {
            messenger.alert('error', err.message);
        };

        new HeaderView;
        APP.router = new Router();

        Backbone.View.prototype.letsUploadFile = function (f, d, cb) {
            var fileImage = f;
            var folder = 'files';
            var onComplete;

            if (typeof d === 'function') {
                onComplete = d;
            } else {
                folder = d ? d : folder;
                onComplete = (typeof cb === 'function') ? cb : function (er, rs) {
                    if (er) {
                        return console.log(er);
                    }
                    console.log(rs);
                };
            }

            if (fileImage) {
                Backendless.Files.upload(fileImage, folder, true, new Backendless.Async(
                    function (result) {
                        onComplete(null, result);
                    },
                    function (err) {
                        onComplete(err);
                    }
                ))
            } else {
                onComplete(null, null)
            }
        };

        Backbone.history.start({silent: true});


        Backendless.UserService
            .getCurrentUser()
            .then(function (user) {
                var url = Backbone.history.fragment || 'home';

                if (Backbone.history.fragment) {
                    Backbone.history.fragment = ''
                }

                if (user && user.objectId) {
                    APP.authorized = true;
                    APP.userId = user.objectId;

                    $('body').addClass('header');
                    Backbone.history.navigate(url, {trigger: true});
                } else {
                    APP.authorized = false;
                    APP.userId = null;

                    $('body').removeClass('header');
                    Backbone.history.navigate('login', {trigger: true});
                }
            })
            .catch(function (err) {
                APP.handleError(err);
            });
    }

    return {
        initialize: initialize
    }
});