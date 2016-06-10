'use strict';

define([
    'backbone',
    'underscore',
    'text!templates/product.html',
    'text!templates/products.html'
], function (Backbone, _, productTemplate, wrapperTemplate) {

    return Backbone.View.extend({
        el: "#wrapper",

        wrapperTemplate: _.template(wrapperTemplate),
        productTemplate: _.template(productTemplate),

        initialize: function () {
            this.render();
        },

        renderProducts: function () {
            var $container = this.$el.find('#productContent').html('');
            var limit      = this.collection.length;

            for(var index = 0; index < limit; index += 1) {
                $container.append(this.productTemplate({ product: this.collection[index], counter: index + 1 }));
            }
        },

        render: function () {
            this.$el.html(this.wrapperTemplate());
            this.renderProducts();

            return this;
        }
    });
});


