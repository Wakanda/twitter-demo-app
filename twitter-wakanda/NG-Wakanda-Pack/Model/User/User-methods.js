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
				cleanName: user.cleanName,
				description: user.description
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


model.User.methods.registerInSession = function(user) {
	var dsUser = ds.User(user.ID);
	sessionStorage.currentUser = dsUser;
};
model.User.methods.registerInSession.scope = "public";


/*
 * Update a user profile. User modified must be the one currently authenticated.
 */
model.User.methods.performProfileUpdate = function(user, login, email, description, cleanName) {
	var dsUser = ds.User(user.id);

	if (login != null && login.length > 3) {
		dsUser.login = login;
	}
	
	if (email != null && email.length > 5) {
		dsUser.email = email;
	}
	
	if (description != null && description.length > 10) {
		dsUser.description = description;
	}
	
	if (cleanName != null && cleanName.length > 3) {
		dsUser.cleanName = cleanName;
	}
	
	dsUser.save();
	return { code: 200, message: "Profile successfully updated." };
};
model.User.methods.performProfileUpdate.scope = "public";
