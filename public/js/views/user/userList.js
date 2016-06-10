'use strict';

define([
    'backbone',
    'underscore',
    'models/models',
    'backendless',
    'text!templates/user/user.html',
    'text!templates/user/userList.html'
], function (Backbone, _, Models, Backendless, userTemplate, containerTemplate) {

    return Backbone.View.extend({
        el : "#wrapper",

        containerTemplate: _.template(containerTemplate),
        userTemplate     : _.template(userTemplate),

        initialize: function () {
            this.UserModel = Models.User;
            this.render();
        },

        events: {
            'click input.uploadFile'  : 'onUploadFile',
            'blur  input.userProps'   : 'onBlur',
            'click td.userProps'      : 'onEdit',
            'click .removeBtn'        : 'onRemove'
        },

        onRemove: function (e) {
            e.preventDefault();

            var collection = this.collection.toJSON();
            var $curTarget = this.$el.find(e.currentTarget);
            var trElem     = $curTarget.closest('tr');
            var userId     = $curTarget.data('id');
            var $trElem    = this.$el.find(trElem);
            var UserModel  = this.UserModel;
            var index;
            var user;

            $trElem.addClass('hideElem');

            index = helper.findElementIndex(collection, userId);
            user  = collection[index];

            Backendless.Persistence.of(UserModel).remove(user)
                .then(function() {
                    APP.successNotification('User has successfully removed');
                })
                .catch(function(err) {
                    $trElem.removeClass('hideElem');
                    APP.handleError(err);
                });
        },

        onEdit: function (e) {
            e.preventDefault();

            var firstElem  = e.currentTarget.children[0];
            var lastElemChild;
            var lastElem;
            var $firstElem;
            var $lastElem;

            if (firstElem.className === 'showElem') {
                lastElem   = e.currentTarget.children[1];
                $firstElem = this.$el.find(firstElem);
                $lastElem  = this.$el.find(lastElem);

                $firstElem.removeClass('showElem');
                $firstElem.addClass('hideElem');
                $lastElem.removeClass('hideElem');
                $lastElem.addClass('showElem').val($firstElem.val());

                lastElemChild = lastElem.children[0];
                lastElemChild.focus();
                lastElemChild.value = firstElem.innerText;
            }
        },

        onBlur: function (e) {
            e.preventDefault();

            var userVal    = e.currentTarget.value;
            var tdElem     = this.$el.find(e.currentTarget).closest('td')[0];
            var $tdElem    = this.$el.find(tdElem);
            var firstElem  = tdElem.children[0];
            var lastElem   = tdElem.children[1];
            var $firstElem = this.$el.find(firstElem);
            var $lastElem  = this.$el.find(lastElem);
            var userId     = $tdElem.data('id');
            var param      = $tdElem.attr('name');
            var collection = this.collection.toJSON();
            var index      = helper.findElementIndex(collection, userId);
            var user       = collection[index];
            var currentParam;

            $firstElem.removeClass('hideElem');
            $firstElem.addClass('showElem');
            $firstElem.text(userVal);
            $lastElem.removeClass('showElem');
            $lastElem.addClass('hideElem');

            if (user[param] !== userVal) {
                currentParam = user[param];
                user[param]  = userVal;

                Backendless.UserService.update(user)
                    .catch(function(err) {
                        $firstElem.text(currentParam);
                        user[param] = currentParam;
                        APP.handleError(err);
                    });
            }
        },

        onUploadFile: function (e) {
            e.preventDefault();

            var $subElem = $(e.currentTarget).siblings();
            var files    = $subElem[0].files;
            var userId   = $subElem.data('id');
            var index;
            var user;

            index = this.collection.map(function (item) {
                return item.objectId;
            }).indexOf(userId);

            user = this.collection[index];

            Backendless.Files
                .saveFile('demoApp', files[0].name, new Blob(files), true)
                .then(function(filePath) {
                    user['avatar'] = filePath;
                    Backendless.UserService.update(user)
                        .then(function () {
                            APP.alertSuccess('New Avatar upload');
                        })
                        .catch(function (err) {
                            APP.alertError(err.message);
                        })
                })
                .catch(function (err) {
                    APP.handleError(err);
                })
        },

        renderUsers: function () {
            var $container = this.$el.find('#usersContent').html('');
            var collection = this.collection.toJSON();
            var limit = collection.length - 1;

            for(var index = 0; index < limit; index += 1) {
                $container.append(this.userTemplate({ user: collection[index], counter: index + 1 }));
            }
        },

        render: function () {
            this.$el.html(this.containerTemplate({ collection: this.collection.toJSON()}));
            this.renderUsers();

            return this;
        }
    });
});


