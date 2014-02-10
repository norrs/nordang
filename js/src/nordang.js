require(["nordang_config", "src/auth",
    "src/dashboard", 'goog!gdata,2.x'],
    function (config, auth, Dashboard) {

    var contactsService;

    function setupContactsService() {
        contactsService = new google.gdata.contacts.ContactsService('nordang-0.1');
    }

    function logMeIn() {
        var scope = 'https://www.google.com/m8/feeds';
        var token = google.accounts.user.login(scope);
        /*
         service.setHeader("Authorization", "Bearer " + accessToken);
         */
    }


    function handleError(e) {
        console.log("There was an error!");
        console.log(e.cause ? e.cause.statusText : e.message);
    }



    var boot = function () {


        setupContactsService();

        dashboard.updateContacts(function () {
            dashboard.renderContactList($('#contactList'));
        });

        /*dashboard.renderContactList($('#contactList'));
        dashboard.renderFacebookFriends($('#fbFriends'));*/
    };

    var dashboard = new Dashboard();

    var firstBoot = false;
    $(config).on("nordang:loginstate:update", function (event) {
        if (config.is_logged_in() && !firstBoot) {
            firstBoot = true;
            boot();
        }
    });
    if (config.is_logged_in() && !firstBoot) {
        firstBoot = true;
        boot();
    }

});