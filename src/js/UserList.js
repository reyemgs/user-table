class UserList {
    constructor() {
        this.userList = [];
    }

    setUser(id, name, date) {
        const user = { id: id, name: name, date: date };
        this.userList.push(user);
    }

    getUserByID(id) {
        return this.userList.find(user => user.id == id);
    }

    getUserByName(name) {
        return this.userList.filter(item =>
            item.name.toLowerCase().startsWith(name.toLowerCase())
        );
    }

    getUserByDate(date) {
        return this.userList.filter(item => item.date.includes(date));
    }

    async loadAllUsers(url) {
        let response = await fetch(url);
        if (response.ok) {
            let data = await response.json();
            const users = data.users;
            return users;
        } else {
            console.error(response.status);
        }
    }
}
