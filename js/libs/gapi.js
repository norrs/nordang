define('libs/gapi', ['async!https://apis.google.com/js/client.js!onload'],
    function(){
        console.log('gapi loaded');
        return gapi;
    }
);