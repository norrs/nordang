define.amd.jQuery = true; // https://github.com/amdjs/amdjs-api/wiki/jQuery-and-AMD

define(["src/gcontacts", "src/fb-helper", "text!templates/contact_list.html", "text!templates/pictures.html",
    "libs/handlebars", "libs/jquery"], function (
    gcontacts, fbhelper, templateContactList, templatePictures) {




    function Dashboard () {
        this.contacts = [];
        this.facebookContacts = [];
        this.canSynchronize = false;

        this._fetchedFacebook = false;
        this._fetchedGoogle = false;
    }
    Dashboard.prototype = {
        has_fetched_resources: function () {
            return this._fetchedFacebook && this._fetchedGoogle;
        },
        fetch_contacts_facebook: function (callback) {
            fbhelper.fetch_friends(function (friends) {
                callback(friends);
            });
        },
        fetch_contacts_google: function (callback) {

            gcontacts.ContactList.refreshGoogleContacts(function (entries) {
                callback(entries);
            });
        },
        'updateContacts': function (callback) {
            var fetchedFacebook = false, fetchedGoogle = false;
            var self = this;

            // http://en.wikipedia.org/wiki/Levenshtein_distance#cite_note-8
            function levenshteinDistance(s,t) {
                // degenerate cases
                if (s === t) return 0;
                if (s.length === 0) return t.length;
                if (t.length === 0) return s.length;

                // create two work vectors of integer distances
                var v0 = new Array(t.length + 1);
                var v1 = new Array(t.length + 1);

                // initialize v0 (the previous row of distances)
                // this row is A[0][i]: edit distance for an empty s
                // the distance is just the number of characters to delete from t
                for (var i = 0; i < v0.length; i++) {
                    v0[i] = i;
                }

                for (var j = 0; j < s.length; j++) {
                    v1[0] = j + 1;
                    // calculate v1 (current row distances) from the previous row v0

                    // first element of v1 is A[i+1][0]
                    //   edit distance is delete (i+1) chars from s to match empty t

                    // use formula to fill in the rest of the row
                    for (var n = 0; n < t.length; n++) {
                        var cost = (s[j] === t[n]) ? 0 : 1;
                        v1[n+1] = Math.min(v1[n]+1, v0[n+1] + 1, v0[n] + cost);
                    }

                    for (var m = 0; m < v0.length; m++) {
                        v0[m] = v1[m];
                    }

                }
                return v1[t.length];
            }



            function helpUpdateContacts (data) {

                function mapProfilePicturesToContact(contact, fbContact) {
                    fbhelper.find_profile_picture_album(function (album) {
                        fbhelper.get_pictures_in_album(album, function (pictures) {
                            contact.facebookConnection.pictures = pictures;
                        });
                    }, fbContact.id);
                }

                if (data instanceof gcontacts.ContactList) {
                    self.contacts = data;
                    fetchedGoogle = true;
                } else {
                    self.facebookContacts = data.data;
                    fetchedFacebook = true;
                }
                if (fetchedFacebook && fetchedGoogle) {
                    debugger;
                    for (var i = 0; i < self.contacts.entries.length; i++) {
                        var contact = self.contacts.entries[i];
                        for (var j = 0; j < self.facebookContacts.length; j++) {
                            var fbContact = self.facebookContacts[j];
                            if (!!contact.fullName) {
                                var distance = levenshteinDistance(contact.fullName, fbContact.name);
                                if (distance <=3) {
                                    console.log(contact.fullName + " -> " + fbContact.name);
                                    contact.facebookConnection = fbContact;
                                    mapProfilePicturesToContact(contact, fbContact);
                                }
                            }
                        }
                    }
                    callback();
                }
            }

            this.fetch_contacts_facebook(helpUpdateContacts);
            this.fetch_contacts_google(helpUpdateContacts);
        },
        'render_photo_series': function (photo_array, selector) {
            var template = Handlebars.compile(templatePictures);
            $(selector).html(template({photos: photo_array.data}));
        },
        'renderContactList': function (selector) {
            var template = Handlebars.compile(templateContactList);
            debugger;
            $(selector).html(template({contacts: this.contacts.entries}));
        },
        'renderFacebookFriends': function (selector) {
            var template = Handlebars.compile(templateContactList);
            fbhelper.fetch_friends(function (friends) {
                console.log(friends);
                //$(selector).html(template({contacts: friends}))
            });
        }

    };




    return Dashboard;
});