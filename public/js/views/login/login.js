'use strict';

define([
    'backbone',
    'constant',
    'validator',
    'underscore',
    'backendless',
    'text!templates/login/login.html'
], function (Backbone, constant, validator, _, Backendless, authTemplate) {

    return Backbone.View.extend({
        el      : "#wrapper",
        template: _.template(authTemplate),

        initialize: function () {
            this.render();
        },

        events: {
            'click #register-form-link': 'letsShowRegisterForm',
            'click #recovery-form-link': 'letsShowRecoveryForm',
            'click #login-form-link'   : 'letsShowLoginForm',
            'click #register-submit'   : 'letsRegister',
            'click #recovery-submit'   : 'letsRecovery',
            'click #login-submit'      : 'letsLogin'
        },

        letsShowRegisterForm: function (e) {
            e.preventDefault();
            var $container = this.$container;

            $container.find('#login-form-link').removeClass('active');
            $container.find('#register-form-link').addClass('active');
            $container.find('#login-form').slideUp(300, function () {
                $container.find('#recovery-form').slideUp(300, function () {
                    $container.find('#register-form').slideDown(300);
                });
            });
        },

        letsShowRecoveryForm: function (e) {
            e.preventDefault();
            var $container = this.$container;

            $container.find('#login-form-link').removeClass('active');
            $container.find('#register-form-link').removeClass('active');
            $container.find('#login-form').slideUp(300, function () {
                $container.find('#recovery-form').slideDown(300);
            });
        },

        letsShowLoginForm: function (e) {
            e.preventDefault();
            var $container = this.$container;

            $container.find('#register-form-link').removeClass('active');
            $container.find('#login-form-link').addClass('active');
            $container.find('#register-form').slideUp(300, function () {
                $container.find('#recovery-form').slideUp(300, function () {
                    $container.find('#login-form').slideDown(300);
                });
            });
        },

        letsRegister: function (e) {
            e.stopPropagation();
            e.preventDefault();

            var self = this;
            var $regContainer = this.$container.find('#register-form');

            var confPass = $regContainer.find('#confPassword').val().trim();
            var email    = $regContainer.find('#email').val().trim();
            var pass     = $regContainer.find('#regPassword').val().trim();
            var name     = $regContainer.find('#username').val().trim();
            var user;
            var fail;

            if (fail = validator.isUsername(name)                   ||
                       validator.isEmail(email)                     ||
                       validator.isPassword(pass)                   ||
                       validator.isPassword(confPass)               ||
                       validator.isMatchedPasswords(pass, confPass)) {

                return APP.warningNotification(fail);
            }

            user = new Backendless.User();
            user.password = pass;
            user.email    = email;
            user.name     = name;

            Backendless.UserService.register(user)
                .then(function (user) {
                    APP.successNotification(user.name + ', you have successfully registered!');
                    self.$container.find('#register-form').slideUp(300, function () {
                        self.$container.find('#login-form').slideDown(300);
                    });
                })
                .catch(function (err) {
                    APP.handleError(err);
                });
        },

        letsRecovery: function (e) {
            e.stopPropagation();
            e.preventDefault();

            var $container = this.$container;
            var email = $container.find('#recoveryEmail').val().trim();
            var fail;

            if (fail = validator.isEmail(email)) {
                return APP.warningNotification(fail);
            }

            Backendless.UserService.restorePassword(email)
                .then(function () {
                    APP.successNotification( "New password has been sent to your email" );

                    $container.find('#recovery-form').slideUp(300, function () {
                        $container.find('#login-form').slideDown(300);
                    });
                })
                .catch(function (err) {
                    APP.handleError(err);
                })
        },

        letsLogin: function (e) {
            e.stopPropagation();
            e.preventDefault();

            var $container = this.$container;
            var $logContainer = $container.find('#login-form');
            var rememberMe = $logContainer.find('#rememberMe').is(":checked");
            var password   = $logContainer.find('#password').val().trim();
            var login      = $logContainer.find('#login').val().trim();
            var fail;

            if (fail = validator.isEmail(login) || validator.isPassword(password)) {
                return APP.warningNotification(fail);
            }

            Backendless.UserService.login(login, password, rememberMe)
                .then(function (user) {
                    APP.successNotification(user.name + ', welcome to our site!');
                    APP.authorized = true;
                    APP.userId = user.objectId;

                    Backbone.history.navigate('#app/home', {trigger: true});
                })
                .catch(function (err) {
                    APP.handleError(err);
                })
        },

        render: function () {
            this.$el.html(this.template());
            this.$container = this.$el.find('#authContainer');

            return this;
        }
    });
});