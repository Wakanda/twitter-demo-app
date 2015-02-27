

model.Tweet.methods.post = function(text, user) {
	var dsUser = sessionStorage.currentUser;
	
	if (dsUser !== null && dsUser.ID == user.id)
	{
		if (text.length <= 140)
		{
			var date = new Date();
			var tweet = ds.Tweet.createEntity();
			tweet.text = text;
			tweet.author = dsUser.ID;
			tweet.date = date;
			
			tweet.save();
					
			return dsTweetToPublic(tweet);
		}
		else
		{
			return 	{
				error: 400,
				message: "Tweet text must not exceed 140 characters"	
			};
		}
	}
	else
	{
		return {
			error: 401,
			message: "You must be logged in"
		};
	}
};
model.Tweet.methods.post.scope = "public";


model.Tweet.methods.retweet = function(tweet, user) {
	var dsTweet = ds.Tweet(tweet.id);
	var dsUser = sessionStorage.currentUser;
	
	if (dsTweet == null)
		return {error: 404, message: "Tweet not found"};
		
	if (dsUser == null || dsUser.ID != user.id)
		return {error: 401, message: "You must be logged in"};
		
	var retweet = new ds.Retweet({tweet: dsTweet.ID, user: dsUser.ID});
	retweet.save();
	
	return {
		id: rewteet.ID,
		tweetId: dsTweet.ID,
		userId: dsUser.ID
	};
};
model.Tweet.methods.retweet.scope = "public";


model.Tweet.methods.homeTweetFeed = function(user) {
	dsUser = sessionStorage.currentUser;
	
	if (dsUser == null || dsUser.ID != user.id)
		return {error: 404, message: "You must be logged in"};
		
	dsUser = ds.User(user.id);
		
	var tweets = dsUser.tweetCollection;
	var follows = dsUser.follows;
	follows.forEach(function (followedUser) {
		tweets = tweets.or(followedUser.tweetCollection);
		tweets = tweets.or(followedUser.retweetedTweets);
	});

    var tweetArray = [];
    tweets.orderBy("date desc").forEach(function (t) {
        tweetArray.push(dsTweetToPublic(t, user.id));
    });
	
	return tweetArray;
};
model.Tweet.methods.homeTweetFeed.scope = "public";

/**
 *
 * @param t
 * @param feedReaderId Tweet are listed for a user that read it, this id is his
 * @returns object
 */
function dsTweetToPublic (t, feedReaderId) {
    var hasBeenRt = t.retweetedBy.find('ID = :1', parseInt(feedReaderId)) != null;
    return {
        id: t.ID,
        text: t.text,
        date: t.date,
        nbRetweet: t.retweetedBy.count(),
        hasBeenRt: hasBeenRt,
        author: {
            id: t.author.ID,
            cleanName: t.author.cleanName,
            login: t.author.login
        }
    };
}


model.Tweet.methods.profileTweetFeed = function(userId, readerId) {
    dsUser = ds.User(userId);

    if (dsUser == null)
        return {error:404, message:"User not found"};

    var tweets = dsUser.tweetCollection;
    tweets = tweets.or(dsUser.retweetedTweets);

    var tweetsArray = [];
    tweets.orderBy("date desc").forEach(function (t) {
         tweetsArray.push(dsTweetToPublic(t, readerId));
    });

    return tweetsArray;
};
model.Tweet.methods.profileTweetFeed.scope = "public";

model.Tweet.methods.search = function(queryString, readerId) {
	var tweets = ds.Tweet.query('text %% :1', queryString);
	var tweetsArray = [];
	
	tweets.forEach(function (t) {
		var a = t.author;
		tweetsArray.push(dsTweetToPublic(t, readerId));
	});
	return tweetsArray;
};
model.Tweet.methods.search.scope = "public";
