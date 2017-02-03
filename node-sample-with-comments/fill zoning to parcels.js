// Code review by Nils Whitmont <nils.whitmont@gmail.com>

// 1. what does this file do?
// NW: Looks like its pulling some property records from MongoDB via mongoose
// NW: ORM methods. Also using setInterval to make sure the records aren't
// NW: being processed too fast that it would crash the app. Then it's adding
// NW: all the resuting properties to the parcels collection & save that to
// NW: the db via mongoose.

// 2. how does this file fit into an application/server?
// NW: data fetching with rate limiting, saving data to db.

// 3. how would you improve the code?
// NW: provide more context for the intent and purpose of these functions and
// NW: code operations going on here. Add usage examples.

// 4. are there any bugs?
// NW - see inline comments below



//process.env.NODE_ENV = 'development';
process.env.NODE_ENV = 'production';
// NW: this is likely a bug
// NW: why is this even here? it's not being used for anything in this file.
// NW: Environment variables should be managed in a config file or in the main
// NW: server.js or app.js file not in random file like this.

var db = require('../libs/database'),
	async = require('async');
// NW: L16/17 do not follow the code style guidelines of proper indentation


var mongoose = require('mongoose'),
	Property = mongoose.model('Property'),
	Parcel = mongoose.model('Parcel');
// NW: code style violation - no multi-line var declarations
// NW: use proper indentation.

var search = { };
// NW: style - extra space between brackets
var n = 0;
// NW: code style violation - not a semantically meaningful variable
// NW: Eg. what does n represent - be more clear to intent here
var date_start = new Date().getTime();
// NW: code style - not using lowerCamelCase - use dateStart instead


//find docs we haven't processed yet
// NW: ^^ this comment doesn't fit with the code style of not using
// NW: simple comments - Use comments to explain complex things instead
// NW: of just comminting routine operations
Property.collection.find(search, function(err, cursor)
// code style - ^^ unnamed anonymous function
{
	if(err) return console.error(err);
	// NW: code style - put statement on next line with indentation
	// NW: eg.
	// NW: 	if(err)
	// NW:		return console.error(err)
	// NW: additionally, do we really want a console error, or do we want to throw an application error?

	cursor.count(function(err, count)
	{
		if(err) return console.error(err);
		// NW: code style - put statement on next line with indentation

		console.info('Found ' + count + ' records to process');
		// NW: this is ok, but could use ES6 string interpolation aka template
		// NW: strings for better readability and easier refactoring.
		// NW: example:
		// NW:		console.info(`Found ${count} records to process`);


		var records_since_last_check = 0;
		// NW: ^^ code style - use recordsSinceLastCheck
		var timer_update = setInterval(function()
		{
			var records_per_second = n - records_since_last_check;
			// NW: ^^ code style - use lowerCamelCase
			// NW: code style - no single letter vars - use meaningful variable names

			console.log('Processed ' + n + ' of ' + count + '\t' + Math.round(n / count * 100) + '%' + '\t' + records_per_second + 'rps');
			// NW: ^^ this is ok, but could use ES6 string interpolation
			records_since_last_check = n;
			// NW: use lowerCamelCase for var names.
		}, 1000);

		cursor.each(function(err, property)
		{
			if(err) return console.error(err);
			// NW: style guide - put statement on next line with indentation

			if(!property)
			{
				clearInterval(timer_update);

				var num_seconds = (new Date().getTime() - date_start) / 1000;
				// NW: use lowerCamelCase for var names.
				var avg_rps = Math.round(n / num_seconds);
				// NW: use lowerCamelCase for var names.

				console.log('DONE!  ' + n + ' records in ' + num_seconds + 'sec, avg ' + avg_rps + 'rps');
				// NW: ^^ this is ok, but could use ES6 string interpolation
				// NW: use lowerCamelCase for var names.
				process.exit();
				return;
			}

			n++;
			// NW: use lowerCamelCase for var names.

			if(!property.parcels)
				return;


			async.forEachOf(property.parcels, function(parcel, i, callback)
			{
				var set =
				// NW: use meaningful var names. set of what? be more specific.
				{
					num_mortgages: property.num_mortgages
					// NW: use lowerCamelCase for var names.
				};

				if(property.mortgages)
					set['mortgages'] = property.mortgages;
				if(property.building)
					set['building'] = property.building;
				if(property.tax)
					set['tax'] = property.tax;

				//point it to its doc
				Parcel.collection.findOneAndUpdate({ _id: parcel._id }, { $set: set }, callback );
			},
			function(err, result)
			{
				if(err)
				console.error(
					'error on\t->',
					property.address.house||'',
					property.address.predir||'',
					property.address.street||'',
					property.address.strtype||'',
					property.address.city||'',
					property.address.state||'',
					property.address.zip||'', err);
			});
		});
	});
});
