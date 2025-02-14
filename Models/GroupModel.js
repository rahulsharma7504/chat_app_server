const  mongoose =require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  userLimit: {
    type: Number,
    required: true,
    min: 1,
    max: 50,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroupMessage',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });


groupSchema.methods.addUser = function(userId) {
  if (this.users.length < this.userLimit) {
    this.users.push(userId);
    return this.save();
  } else {
    throw new Error('User limit exceeded');
  }
};

groupSchema.methods.removeUser = function(userId) {
  const index = this.users.indexOf(userId);
  if (index > -1) {
    this.users.splice(index, 1);
    return this.save();
  } else {
    throw new Error('User not found in the group');
  }
};

groupSchema.methods.getUsers = function() {
  return this.users;
};

groupSchema.methods.clearUsers = function() {
  this.users = [];
  return this.save();
};

groupSchema.methods.getUserCount = function() {
  return this.users.length;
};

groupSchema.methods.getUsers = function() {
  return this.users;
};


const Group = mongoose.model('Group', groupSchema);

module.exports= Group;