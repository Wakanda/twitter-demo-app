

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
					
			return {
				id: tweet.ID,
				text: tweet.text,
				author: {
					id: tweet.author.ID,
					login: tweet.author.login
				},
				date: tweet.date
			};
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
