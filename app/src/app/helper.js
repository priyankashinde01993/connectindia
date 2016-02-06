/**
 * Created by kalpesh on 19/11/15.
 */
//Helper utility functions

APP.factory('AppHelpers',function() {

    return {
        randomString : function() {
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

            var length = length || 10;
            var string = '', rnd;
            while (length > 0) {
                rnd = Math.floor(Math.random() * chars.length);
                string += chars.charAt(rnd);
                length--;
            }
            return string;
        }

    }
});