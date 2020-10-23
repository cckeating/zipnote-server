/**
 * Builds relationships between database models
 *  */
const { User, Note } = require('./models');

User.hasMany(Note);
Note.belongsTo(User);
