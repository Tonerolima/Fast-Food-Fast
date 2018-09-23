import bcrypt from 'bcryptjs';
import uniqId from 'uniqid';

export default {
  records: [],
  create(userObject) {
    if (this.findByUsername(userObject.username)) { return false; }
    const newUser = (({username, firstname, lastname, email}) => ({username, firstname, lastname, email}))(userObject);
    newUser.id = uniqId();
    bcrypt.genSalt(10, async (err, salt) => {
      await bcrypt.hash(userObject.password, salt, (error, hash) => {
        newUser.password = hash;
        this.records.push(newUser);
      });
    });
    return newUser;
  },
  findByUsername(username) {
    return this.records.find(record => record.username === username);
  },
};
