define.amd.jQuery = true; // https://github.com/amdjs/amdjs-api/wiki/jQuery-and-AMD

//To load google libraries you should follow the format "goog!moduleName,version,packages:[packages],language:en,anotherOption:value"
define(["nordang_config", "src/fb-helper", 'libs/gapi', "libs/handlebars", "libs/jquery"], function (config, fbhelper, gapi) {
    function checkAuth() {
        gapi.auth.authorize({client_id: config.gapi_clientId, scope: config.gapi_scopes, immediate: true}, handleAuthResult);
    }

    FB.init({
        appId: config.fb_appkey,
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true  // parse XFBML
    });

    FB.Event.subscribe('auth.authResponseChange', function (response) {
        console.log("woop");
        // Here we specify what we do with the response anytime this event occurs.
        if (response.status === 'connected') {
            // The response object is returned with a status field that lets the app know the current
            // login status of the person. In this case, we're handling the situation where they
            // have logged in to the app.
            config.fb_logged_in = true;

            //dashboard.fetch_friends();
            //dashboard.fetch_profile_picture();

            /* fbhelper.find_profile_picture_album(function (album) {
             fbhelper.get_pictures_in_album(album, function (pictures) {
             dashboard.render_photo_series(pictures, '#pictures');
             });
             });
             */

        } else if (response.status === 'not_authorized') {
            // In this case, the person is logged into Facebook, but not into the app, so we call
            // FB.login() to prompt them to do so.
            // In real-life usage, you wouldn't want to immediately prompt someone to login
            // like this, for two reasons:
            // (1) JavaScript created popup windows are blocked by most browsers unless they
            // result from direct interaction from people using the app (such as a mouse click)
            // (2) it is a bad experience to be continually prompted to login upon page load.
            config.fb_logged_in = false;
            FB.login(function (response) {
            }, { scope: 'user_photos,friends_photos'});

        } else {
            // In this case, the person is not logged into Facebook, so we call the login()
            // function to prompt them to do so. Note that at this stage there is no indication
            // of whether they are logged into the app. If they aren't then they'll see the Login
            // dialog right after they log in to Facebook.
            // The same caveats as above apply to the FB.login() call here.
            config.fb_logged_in = false;
            FB.login(function (response) {
            }, { scope: 'user_photos,friends_photos'});
        }

        $(config).trigger("nordang:loginstate:update");

    });


    gapi.client.setApiKey(config.gapi_apiKey);
    window.setTimeout(checkAuth, 1);


    function handleAuthResult(authResult) {
        var authorizeButton = document.getElementById('authorize-button');
        if (authResult && !authResult.error) {
            authorizeButton.style.visibility = 'hidden';
            config.gapi_session = authResult;
            config.gapi_logged_in = true;
        } else {
            config.gapi_logged_in = false;
            config.gapi_session = null;
            authorizeButton.style.visibility = '';
            authorizeButton.onclick = handleAuthClick;

        }
        $(config).trigger("nordang:loginstate:update");
    }

    function handleAuthClick(event) {
        // Step 3: get authorization to use private data
        gapi.auth.authorize({client_id: config.gapi_clientId, scope: config.gapi_scopes, immediate: false}, handleAuthResult);
        return false;
    }

});