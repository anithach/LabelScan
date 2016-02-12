/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema(
		{
			name : String,
			emailaddress : String,
			phone   : String,
			subject: String,
			message : String,
			submit_dt : Date
		});

contactSchema.set('collection', 'contact');

var Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;

