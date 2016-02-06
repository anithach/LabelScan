/**
 * http://usejsdoc.org/
 */

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    company: String,
    emailaddress: { type: String, required: true, unique: true },
    logo: String,
    primaryPhone: String,
    secondaryPhone: String,
    adressLine1: String,
    adressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.set('collection', 'users');

userSchema.methods.generateHash = function(password) 
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) 
{
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
