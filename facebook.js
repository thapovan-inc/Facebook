var FB = require('fb');

var postStatus = function (req, res, access_token, text) {

    var status = false;

    FB.setAccessToken(access_token);
    var body = text;
    FB.api('me/feed', 'post', { message: body }, function (res) {
        if (!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            status = false;
        }
        if (res.id > 0)
            status = true;
    });
    return status;
};


var deleteStatus = function (req, res, access_token, postId) {
    var status = false;
    FB.setAccessToken(access_token);
    FB.api(postId, 'delete', function (res) {
        if (!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            status = false;
        }
        status = true;
    });

    return status;
};


var getProfileData = function (req, res, id, access_token) {
    var profile = {};
    FB.setAccessToken(access_token);
    FB.api(id, { fields: ["name", "currency", "education", "email", "birthday", "age_range", "about", "hometown"] }, function (req, res) {
        if (!req || req.error) {
            console.log(!req ? 'error occurred' : req.error);
            return;
        }
        profile.birthday = req.birthday;
        profile.name = req.name;
        profile.email = req.email;
        profile.age_range = req.age_range;

    });

};


module.exports = {
    postStatus: postStatus,
    getProfileData: getProfileData
};