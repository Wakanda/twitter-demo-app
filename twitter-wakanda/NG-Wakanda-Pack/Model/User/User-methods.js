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

model.User.methods.performProfilePictureUpdate = function(user, file) {
	var dsUser = ds.User(user.id);

	dsUser.profilePicture = file;
	
	dsUser.save();
	return { code: 200, message: "Profile successfully updated." };
};

model.User.methods.register = function (user) {
	if (user.login && user.password && user.email) {
        dsUser = new ds.User();
        dsUser.login = user.login;
        dsUser.email = user.email;
        dsUser.password = directory.computeHA1(dsUser.ID, user.password);
        dsUser.description = user.description;
        dsUser.cleanName = user.login;

        dsUser.save();

        sessionStorage.currentUser = dsUser;

        return {
            id: dsUser.ID,
            login: dsUser.login,
            email: dsUser.email,
            cleanName: dsUser.cleanName,
            description: dsUser.description
        };
    }
    else
        return {error: 400, message: "Login, password and email are mandatory"};
};
model.User.methods.register.scope = "public";
model.User.methods.performProfileUpdate.scope = "public";


model.User.methods.getWithId = function(userId) {
    dsUser = ds.User(userId);

    if (dsUser == null)
        return {error: 404, message: "User not found"};

    return {
        id: dsUser.ID,
        login: dsUser.login,
        email: dsUser.email,
        cleanName: dsUser.cleanName,
        description: dsUser.description,
        nbFollows: dsUser.follows.count(),
        nbFollowers: dsUser.followers.count()
    };
};
model.User.methods.getWithId.scope = "public";