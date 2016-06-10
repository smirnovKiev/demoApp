'use strict';

var APP = APP || {};

require.config({
    paths: {
        // libs func
        backendless      : './libs/backendless/backendless.min',
        underscore       : './libs/underscore/underscore',
        bootstrap        : './libs/bootstrap/dist/js/bootstrap.min',
        backbone         : './libs/backbone/backbone',
        jquery_ui        : './libs/jquery-ui/jquery-ui.min',
        jquery           : './libs/jquery/dist/jquery',
        toastr           : './libs/toastr/toastr.min',
        moment           : './libs/moment/moment',
        text             : './libs/text/text',

        // custom func
        messenger        : './helpers/messenger',
        validator        : './helpers/validator',
        constant         : './constants/constants',
        helper           : './helpers/helper',
        dater            : './helpers/dater',

        // components
        collections      : './collections',
        templates        : '../templates',
        models           : './models',
        views            : './views'
    },
    shim: {
        jquery : {
            exports      : '$'
        },

        backbone: {
            deps         : ['underscore', 'jquery'],
            exports      : 'backbone'
        },

        toastr: {
            deps         : ['jquery'],
            exports      : 'toastr'
        },

        underscore: {
            exports      : '_'
        },

        backendless: {
            exports: 'backendless'
        }
    }
});

require([
    'app',
    'constant',
    'backendless'
],  function (app, constant, Backendless) {
    var SECRET_KEY = constant.BC_CREDENTIALS.KEY;
    var VERSION    = constant.BC_CREDENTIALS.VERSION;
    var APP_ID     = constant.BC_CREDENTIALS.ID;

    Backendless.initApp(APP_ID, SECRET_KEY, VERSION);
    Backendless.enablePromises();

    app.initialize();
});