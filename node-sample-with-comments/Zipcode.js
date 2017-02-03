// Code review by Nils Whitmont <nils.whitmont@gmail.com>

// 1. what does this file do?
// NW: This is the mongoose ORM schema definition for the Zipcode object

// 2. how does this file fit into an application/server?
// NW: Allows your JS code to talk to the database (MongoDB) with less
// NW: boilerplate code.

// 3. how would you improve the code?
// NW: Add JSDoc comments & context info about how this is used in the app
// NW: For example, there are a lot of coded var names like `ZCTA5CE10`,
// NW: explain what this stuff means for future reference & team sharing

// 4. are there any bugs?
// NW: 1. `date_loaded` var - style guide - use lowerCamelCase for var names
// NW: 2. don't leave commented out code in your files, use source control
// NW: 3. Did you forget to import the `zipcodes.js` source data used for
// NW: model creation on the last line?


var mongoose = require('mongoose');

var Zipcode = new mongoose.Schema(
{
	properties:
	{
		ZCTA5CE10:
		{
			type: String,
			index: { unique: true }
		},

		GEOID10:
		{
			type: String,
			index: { unique: true }
		},

		CLASSFP10: String,
		MTFCC10: String,
		FUNCSTAT10: String,

		ALAND10: Number, //area of land
		AWATER10: Number, //area of water

		INTPTLAT10: Number,
		INTPTLON10: Number
	},

	/*
	geometry:
	{
		type: [Number],
		index: '2dsphere'
	},
	*/

	date_loaded: { type: Date, default: Date.now }
});


mongoose.model('Zipcode', Zipcode, 'zipcodes');
