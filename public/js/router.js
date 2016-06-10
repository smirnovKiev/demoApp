'use strict';

define([
    'backbone',
    'backendless',
    'models/models'
], function (Backbone, Backendless, Models) {

    return Backbone.Router.extend({
        view: null,

        routes: {
            'app/home'           : 'onHome',
            'app/login'          : 'onLogin',
            'app/users'          : 'onUsers',
            'app/chat'           : 'onChat',
            // 'app/category/:title': 'onCategory',
            '*any'               : 'default'
        },

        onHome: function () {
            var self = this;
            var UserModel = Models.User;
            var dataQuery = {
                options : { pageSize : 50, sortBy: ['name'] }
            };

            Backendless.Persistence.of(UserModel)
                .find(dataQuery)
                .then(function (response) {
                    require(['views/user/userList'], function (WrapperView) {
                        var userList = response.data;
                        var userCollection;
                        var UserCollection = Backbone.Collection.extend({
                            model: Backbone.Model.extend({
                                'idAttribute': 'objectId'
                            })
                        });

                        userCollection = new UserCollection(userList);

                        self.view ? self.view.undelegateEvents() : null;
                        self.view = new WrapperView({collection: userCollection});
                    });
                })
                .catch(function (err) {
                    APP.handleError(err);
                });
        },

        onChat: function () {
            var self = this;

            require(['views/chat/chat'], function (WrapperView) {
                if(self.view){
                    self.view.undelegateEvents();
                }

                self.view = new WrapperView();
            });
        },

        onLogin: function () {
            var self = this;

            require(['views/login/login'], function (WrapperView) {
                $('#headerContent').slideDown(100);
                self.view ? self.view.undelegateEvents() : null;
                self.view = new WrapperView();
            });
        },

        // onUsers: function () {
        //     var self = this;
        //
        //     var UserModel = Models.User;
        //     var dataQuery = {
        //         options : { pageSize : 6, sortBy: ['name'] }
        //     };
        //
        //     Backendless.Persistence.of(UserModel)
        //         .find(dataQuery)
        //         .then(function (response) {
        //             require(['views/user/userList2'], function (WrapperView) {
        //                 var userList = response.data;
        //                 var userCollection;
        //                 var UserCollection = Backbone.Collection.extend({
        //                     model: Backbone.Model.extend({
        //                         'idAttribute': 'objectId'
        //                     })
        //                 });
        //
        //                 userCollection = new UserCollection(userList);
        //
        //                 self.view ? self.view.undelegateEvents() : null;
        //                 self.view = new WrapperView({collection: userCollection});
        //             })
        //         })
        //         .catch(function (err) {
        //             APP.handleError(err);
        //         });
        // },
        //
        // onCategory: function (title) {
        //     var self = this;
        //     var CategoryModel = Models.Category;
        //
        //     Backendless.Persistence.of( CategoryModel )
        //         .find({ condition: 'title=\'' + title  +  '\'' })
        //         .then(function(response) {
        //             require(['views/products'], function (WrapperView) {
        //                 self.view ? self.view.undelegateEvents() : null;
        //                 self.view = new WrapperView({ collection: response.data[0].products });
        //             });
        //         })
        //         .catch(function(err) {
        //             APP.handleError(err);
        //         });
        // },

        default: function () {
            Backbone.history.navigate('#app/home', { trigger: true });
        }
    });
});