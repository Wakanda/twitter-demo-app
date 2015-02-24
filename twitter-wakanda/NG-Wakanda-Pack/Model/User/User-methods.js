model.User.entityMethods.validatePassword = function(password) {
    var ha1 = directory.computeHA1(this.ID, password);
    return ha1 === this.password;
};

model.User.methods.performLogin = function(login, password) {
	var user = ds.User({login: login});
	
	if (user == null)
		return {error: 401, message: "Invalid username or password"};
	else
	{
		if (user.validatePassword(password))
		{
			sessionStorage.currentUser = user;
			return {
				id: user.ID,
				login: user.login,
				email: user.email,
				cleanName: user.cleanName
			};
		}
		else
			return {error: 401, message: "Invalid username or password"};
	}
};
model.User.methods.performLogin.scope = "public";


model.User.methods.performLogout = function() {
	sessionStorage.currentUser = null;
};
model.User.methods.performLogout.scope = "public";
