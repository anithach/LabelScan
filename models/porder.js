/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var poSchema = new Schema(
		{
			ponum : String,
			bqcode : String,
			itemnum : String,
			code   : Number,
			fdaregno: Number,
			traceid : Number,
			productwgt : String,
			producttype : String,
			packing : String,
			corigin : String,
			company : String,
			processor : String,
			submit_date : Date,
			prod_date : Date,
			username : String
		});

poSchema.set('collection', 'purchaseOrders');

var Pord = mongoose.model('PO', poSchema);

module.exports = Pord;

