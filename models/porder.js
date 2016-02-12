/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var poSchema = new Schema(
		{
			ponumber : String,
			prodcode : String,
			proddate : String,
			vendor   : String,
			countryoforigin: String,
			fdaregno : String,
			tracebilityid : String,
			producttype : String,
			productweight : String,
			itemperpound : String,
			qrcode : String,
			username : String,
			submit_dt : Date
		});

poSchema.set('collection', 'purchaseOrders');

var Pord = mongoose.model('PO', poSchema);

module.exports = Pord;

