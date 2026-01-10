const { generateUUID } = require('../utils/idGenerator');

const users = [];

class UserModel {
  static create(userData) {
    const newUser = {
      id: generateUUID(),
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: userData.role || 'attendee', // 'organizer' or 'attendee'
      createdAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  }

  static findByEmail(email) {
    return users.find((u) => u.email === email);
  }

  static findById(id) {
    return users.find((u) => u.id === id);
  }

  static getAll() {
    return users;
  }

  static update(id, updateData) {
    const user = this.findById(id);
    if (user) {
      Object.assign(user, updateData);
    }
    return user;
  }

  static delete(id) {
    const index = users.findIndex((u) => u.id === id);
    if (index > -1) {
      users.splice(index, 1);
      return true;
    }
    return false;
  }

  static getAllOrganizers() {
    return users.filter((u) => u.role === 'organizer');
  }

  static getAllAttendees() {
    return users.filter((u) => u.role === 'attendee');
  }
}

module.exports = UserModel;
