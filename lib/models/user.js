import bcrypt from 'bcryptjs';
import uniqId from 'uniqid';

export default {
  records: [],
  create(username, password, name) {
    if (this.findByUsername(username)) { return false; }
    const newUser = {};
    newUser.username = username;
    newUser.name = name;
    newUser.id = uniqId();
    bcrypt.genSalt(10, async (err, salt) => {
      await bcrypt.hash(password, salt, (error, hash) => {
        newUser.password = hash;
        this.records.push(newUser);
      });
    });
    return newUser;
  },
  findByUsername(username) {
    const user = this.records.find(record => record.username === username);
    if (!user) { return false; }
    return user;
  },
  findById(id) {
    const user = this.records.find(record => record.id === id);
    if (!user) { return false; }
    return user;
  },
  find() {
    return this.records;
  },
};
