'use strict';

define(['moment'], function (moment) {

    // return date in format 2012/12/12
    function formatDate(date) {
        return moment(date).format('L');
    }

    return {
        formatDate: formatDate
    }
});