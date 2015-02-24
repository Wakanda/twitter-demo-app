
/*
 * Validating parameters before saving a new user
 */
Parse.Cloud.beforeSave("_User", function(request, response) {
    var userEmail = request.object.get("email");
    var userUsername = request.object.get("email");
    var userHashedPassword = request.object.get("email");

    if (typeof userEmail == 'undefined' ||
        !validateEmail(userEmail)) {
        response.error("Email does not conform to standard email format.");
    }
    else if (typeof userUsername == 'undefined' ||
             userUsername.length < 3) {
        response.error("Username is too short. Please use at least 3 characters.");
    }
    else if (typeof userHashedPassword == 'undefined' ||
             userHashedPassword.length < 2) {
        response.error("Password is not valid, hash is too short. Please check and update.");
    }
    else {
        response.success();
    }
});

/*
 * Validating parameters before saving a new tweet
 */
Parse.Cloud.beforeSave("Tweet", function(request, response) {
    var tweetType = request.object.get("type");
    var tweetAuthor = request.object.get("author");
    var tweetContent = request.object.get("content"); //This is a _User instance

    if (typeof tweetType == 'undefined' ||
        ["standard", "reply", "retweet"].indexOf(tweetType) == -1) {
        response.error("Type is not valid. Please specify one belonging to allowed list.");
    }
    else if (typeof tweetAuthor == 'undefined') {
        response.error("Author is not specified. Please provide a reference to this instance author.")
    }
    else if (typeof tweetContent == 'undefined') {
        response.error("Content is empty, you cannot use this content as a valid value.");
    }
    else if (tweetContent.length > 140) {
        response.error("Tweet length exceeds 140 characters. Please truncate and try it again.");
    }
    else {
        response.success();
    }
});

/*
 * Retrieve the feed for the current user
 */
Parse.Cloud.define("getFeed", function(request, response) {
    var currentUser = request.user;
    if (typeof currentUser == 'undefined') {
        response.error("No active user detected. Please use this method after getting authenticated.");
    }
    else {
        var ModelUserSubscription = Parse.Object.extend("UserSubscription");
        var ModelTweet = Parse.Object.extend("Tweet");

        var subscriptionListQuery = new Parse.Query(ModelUserSubscription);
        subscriptionListQuery.equalTo("fromUser", currentUser);

        var tweetListQuery = new Parse.Query(ModelTweet);
        tweetListQuery.matchesKeyInQuery("author", "toUser", subscriptionListQuery);
        tweetListQuery.descending("updatedAt");
        tweetListQuery.find({
            success: function(results) {
                console.log("Found: ", results);
                response.success(results);
            },
            error: function(error) {
                response.error("Error while requesting user feed: " + error.code + " - " + error.message);
            }
        });
    }
});

/*
 * Return whether a string is conforming to email standard format or not
 */
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};