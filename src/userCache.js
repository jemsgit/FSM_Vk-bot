class UserCache {
    constructor() {
        this.users = {}
    }

    setUserState(userId, state) {
        if(!this.users[userId]) {
            this.users[userId] = {}
        }
        this.users[userId] = state;
    }

    getUserState(userId) {
        return this.users[userId];
    }

    loadUserStates() {
        return [];
    }
}

var userCache = new UserCache();

module.exports = userCache;