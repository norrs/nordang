define.amd.jQuery = true; // https://github.com/amdjs/amdjs-api/wiki/jQuery-and-AMD

define([], function () {

    var config = {
        'fb_appkey': '577882115615029',
        'gapi_clientId': '694130127950.apps.googleusercontent.com',
        'gapi_apiKey': 'JIMTF03vlYuMH209VhGmK1me',
        'gapi_scopes': 'https://www.google.com/m8/feeds',
        'fb_logged_in': false,
        'gapi_logged_in': false,
        'is_logged_in': function () { return !!this.fb_logged_in && !!this.gapi_logged_in; },
        'gapi_session': null
    };
    return config;
});