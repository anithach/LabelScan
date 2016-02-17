/**
 * http://usejsdoc.org/
 */

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    company: String,
    emailaddress: {
        type: String,
        trim: true,
        unique: 'This email is already registered, please use a different email address',
        required: 'Email address is required',       
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
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
    resetPasswordExpires: Date,
	create_dt : Date,
	activateToken: String,
	activateTokenExpires: Date,
	update_dt : {type: Date, default: Date.now },
	status : Number
});

userSchema.set('collection', 'USERS');

userSchema.methods.generateHash = function(password) 
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) 
{
    return bcrypt.compareSync(password, this.password);
};



module.exports = mongoose.model('User', userSchema);
