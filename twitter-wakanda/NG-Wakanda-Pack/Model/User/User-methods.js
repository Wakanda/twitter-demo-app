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
	var dsUser = sessionStorage.currentUser;
	
	if (dsUser !== null && dsUser.ID == user.id) // Just checking whether the client-side and server-side logged in users are the same instance
	{
		if (login != null && login.length > 3) {
			dsUser.login = login;
		}
		
		if (password != null && password.length > 3) {
			dsUser.password = password;
		}
		
		if (email != null && email.length > 5) {
			dsUser.email = email;
		}
		
		if (description != null && cleanName.length > 10) {
			dsUser.description = description;
		}
		
		if (cleanName != null && cleanName.length > 3) {
			dsUser.cleanName = cleanName;
		}
		
		dsUser.save();
		return { code: 200, message: "Profile successfully updated." };
	}
	else
	{
		return {
			error: 401,
			message: "You must be logged in"
		};
	}
};
model.User.methods.performProfileUpdate.scope = "public";
