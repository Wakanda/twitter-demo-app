model.User.password.events.set = function(a) {
    this.password = directory.computeHA1(this.ID, this.password)
}