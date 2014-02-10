define(['nordang_config'], function (config) {

    function ContactList(contactList) {
        this.entries = [];

        function parse (v3JsonContactList) {
            this.raw = v3JsonContactList;
            for (var i = 0; i < v3JsonContactList.length; i++) {
                var contactEntry = v3JsonContactList[i];
                this.add(new ContactEntry(contactEntry));
            }
        }
        parse.call(this, contactList);
    }

    ContactList.prototype = {
        add: function (contactEntry) {
            this.entries.push(contactEntry);
        }
    };
    ContactList.refreshGoogleContacts = function (callback) {
        console.log('https://www.google.com/m8/feeds/contacts/default/full?v=3.0&alt=json&' + config.gapi_session.access_token);
        var max_results = 10;
        var contactsFeedUri = 'https://www.google.com/m8/feeds/contacts/default/full?v=3.0&alt=json&max-results=' + max_results + '&callback=?&access_token=' + config.gapi_session.access_token;
        var entries = [];
        $.getJSON(contactsFeedUri, function (result) {
            //console.log(JSON.stringify(result));
            callback(new ContactList(result.feed.entry));
        });
    };


    function ContactEntry(v3jsonContactEntry) {
        this.fullName = null;
        this.givenName = null;
        this.familiyName = null;
        this.emailAddresses = [];
        this.photo = null;
        this.facebookConnection = null;

        function parse (contact) {
            var i = 0;
            if (!!contact.gd$name) {
                if (!!contact.gd$name.gd$fullName) this.fullName = contact.gd$name.gd$fullName.$t;
                if (!!contact.gd$name.gd$givenName) this.givenName = contact.gd$name.gd$givenName.$t;
                if (!!contact.gd$name.gd$familyName) this.familiyName = contact.gd$name.gd$familyName.$t;
            }

            if (!!contact.gd$email) {
                for (i = 0; i < contact.gd$email.length; i++) {
                    var email = contact.gd$email[i];
                    this.emailAddresses.push(email.address);
                }
            }
            for (i = 0; i < contact.link.length; i++) {
                var link = contact.link[i];
                if (link.type === 'image/*') {
                    this.photo = link;
                    break;
                }
            }
        }
        parse.call(this, v3jsonContactEntry);

    }
    ContactEntry.prototype = {

    };

    return {
        'ContactList': ContactList,
        'ContactEntry': ContactEntry
    };
});