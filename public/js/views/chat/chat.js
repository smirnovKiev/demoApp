'use strict';

define([
    'backbone',
    'underscore',
    'backendless',
    'text!templates/chat/chat.html'
], function (Backbone, _, Backendless, chatTemplate) {

    return Backbone.View.extend({
        el: "#wrapper",
        $name_field:'#name-field',
        $messages_history_field: '#messages-history-field',
        $message_field: '#message-field',
        CHANNEL: 'default',

        chatTemplate: _.template(chatTemplate),

        events: {
            'click #startChat': 'subscribe',
            'click #send': 'publish',
            'keyup #message-field': 'onPressEnter'
        },

        initialize: function () {
            this.render();
        },

        subscribe: function () {
            if( !$(this.$name_field).val() )
            {
                alert( "Enter your name" );
                return;
            }

            var subscriptionOptions = new SubscriptionOptions(); //there'll be userData

            Backendless.Messaging.subscribe( this.CHANNEL, this.onMessage, subscriptionOptions, new Backendless.Async( this.onSubscribed, this.onFault ) );
        },

        publish: function () {
            if( !this.$message_field )
                return;

            var publishOptions = new PublishOptions();
            var inputText = $(this.$message_field).val();

            publishOptions.publisherId = $(this.$name_field).val();
            Backendless.Messaging.publish( this.CHANNEL, inputText, publishOptions, null,  new Backendless.Async(function(){}, this.onFault) );
            $(this.$message_field).val(null);
        },

        onSubscribed: function () {
            $( '#welcome-screen' ).hide();
            $( '#chat_screen' ).show();
        },

        onMessage: function (result) {
            var $conteiner = '#messages-history-field';

            $.each( result.messages, function ()
            {
                $($conteiner).html( this.publisherId + ": " + this.data + "<br/>" + $($conteiner).html() );
            } );
        },

        onPressEnter: function (event) {
            if(event.keyCode == 13){
                this.publish();
            }
        },

        onFault: function (fault) {
            alert( fault.message );
        },

        render: function () {
            this.$el.html(this.chatTemplate());

            return this;
        }
    });
});