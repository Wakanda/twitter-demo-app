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

/*
 * Update a user profile. User modified must be the one currently authenticated.
 */
model.User.methods.performProfileUpdate = function(user, login, password, email, description, cleanName) {
	var dsUser = sessionStorage.currentUser;

	if (dsUser !== null && dsUser.ID == user.id) //Just checking whether the client-side and server-side logged in users are the same instance
	{
		var error = null;

		if (login != null && login.length > 3) {
			dsUser.login = login;
		}
		else {
			error = { code: 400, message: "Login length must be at least 3 characters." };
		}

		if (password != null && password.length > 3) {
			dsUser.password = password;
		}
		else {
			error = { code: 400, message: "Password length must be at least 3 characters." };
		}

		if (email != null && email.length > 5) {
			dsUser.email = email;
		}
		else {
			error = { code: 400, message: "Email length must be at least 5 characters." };
		}

		if (description != null && cleanName.length > 10) {
			dsUser.description = description;
		}
		else {
			error = { code: 400, message: "Description length must be at least 10 characters." };
		}

		if (cleanName != null && cleanName.length > 3) {
			dsUser.cleanName = cleanName;
		}
		else {
			error = { code: 400, message: "CleanName length must be at least 3 characters." };
		}

		if (error == null) { // No error found, user modifications will be saved
			dsUser.save();
			return { code: 200, message: "Profile successfully updated." };
		}
		else { // An unexpected error happened, must be fixed before processing to profile update
			return error;
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
            cleanName: dsUser.cleanName
        };
    }
    else
        return {error: 400, message: "Login, password and email are mandatory"};
};
model.User.methods.register.scope = "public";
