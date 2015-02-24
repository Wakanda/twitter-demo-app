Parse.initialize("ygteZzN9DlTDyD4Pw0RXiDopzYGik9MWse8NvHqW", "LRPIHOV5UxnwIzfz7ga0kJnvb19e6rNDNLU1UzYn");

Parse.User.logIn("mrblackus", "testtest", {
    success: function(user) {
        console.log("Successfully logged in");

        Parse.Cloud.run("getFeed", null, {
            success: function(tweets) {
                console.log("Tweets found: " + tweets.length);
                console.log(tweets);
            },
            error: function(error) {
                console.log("Error while retrieving feed: " + error.message);
            }
        });
    },
    error: function(user, error) {
        console.error("User not logged in: " + error.message);
    }
});