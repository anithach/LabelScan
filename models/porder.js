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
			prodcode   : Number,
			fdaregno: Number,
			traceid : Number,
			productwgt : String,
			producttype : String,
			packing : String,
			corigin : String,
			company : String,
			processor : String,
			submit_date : Date,
			proddate : Date,
			username : String
		});

poSchema.set('collection', 'PURCHASEORDERS');

var Pord = mongoose.model('PO', poSchema);

module.exports = Pord;

