define.amd.jQuery = true; // https://github.com/amdjs/amdjs-api/wiki/jQuery-and-AMD

define(["facebook"], function (facebook) {

    var dashboard = {
        'fetch_friends': function (callback) {
            FB.api('/me/friends', function (response) {
                callback(response);
            });
        },
        'fetch_profile_picture': function () {
            FB.api('/me/picture?width=200&redirect=0&type=normal&height=200', function (response) {
                console.log(response);
            });
        },
        'fetch_albums': function () {
            FB.api('/me/albums', function (response) {
                return response;
            });
        },
        'find_profile_picture_album': function (callback, id) {
            if (!id) {
                id = 'me';
            }
            FB.api('/'+id+'/albums', function (albums) {
                for (var i = 0; i < albums.data.length; i++) {
                    var album = albums.data[i];
                    if (album.type === 'profile') {
                        return callback(album);
                    }
                }
                return callback();
            });
            //type: "profile"

        },
        'get_pictures_in_album': function (album, callback) {
            FB.api('/'+album.id+"/photos", function (pictures) {
                return callback(pictures);
            });
        }
    };
    return dashboard;

});