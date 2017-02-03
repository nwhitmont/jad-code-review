// Code review by Nils Whitmont <nils.whitmont@gmail.com>

// 1. what does this file do?
// NW: looks like it uses a zip code to calculate a map location for placing
// NW: interface elements on a map view.

// 2. how does this file fit into an application/server?
// NW: translates address/zipcode info to geospacial map coordinates within
// NW: the defined parameters.

// 3. how would you improve the code?
// NW: Provide context how this fits into the application. Maybe all URLs to
// NW: relevant documentaion; mapping stuff can get complicated, good to
// NW: have the reference links close by.

// 4. are there any bugs?
// NW: see inline comments below.


var config = require('../config');
	projection = require('../libs/projection'),
	gj = require('../libs/gj');
// NW: style guide - no multi-line var declarations
// NW: style guide - use meaningful var names. what is the intent of `gj`?
// NW: if its the geojson library/module, call it by its proper name, this
// NW: shorthand is unnecessary and confusing.

var mongoose = require('mongoose'),
	Zipcode = mongoose.model('Zipcode');
// NW: style guide - no multi-line var declarations


var SphericalMercator = require('sphericalmercator'),
	mercator = new SphericalMercator();
// NW: style guide - no multi-line var declarations

// NW: maybe add comment explaining what the tolerances relate to in this
// NW: operation.
var tolerances =
{
	5:	0.01000,
	6:	0.02000,
	7:	0.01000,
	8:	0.00500,
	9:	0.00150,
	10:	0.00090,
	11:	0.00050,
	12:	0.00012,
	13:	0.00008,
	14:	0.00006,
	15:	0.00003,
	16:	0.00001
};
// NW: style guide - use quotes for key names.


exports.tile = function(req, res, next)
{
	var z = parseInt(req.params.z);
	var x = parseInt(req.params.x);
	var y = parseInt(req.params.y);
	// NW: since these are mathematical var names for coordinates maybe this is
	// NW: ok? otherwise rename to semantically meaningful var names


	//we aren't at the minimum zoom level required
	// NW: possible unnecessary comment
	if(z <= 7 || z >= 18)
	{
		//TODO: bundle an error message in the header
		return res.json([]);
		// NW: what is this return statement doing here? the results json is empty
		// NW: the todo comment implies something about error handing, but the
		// NW: code here seems to have nothing to do with that. remove it since
		// NW: it does nothing. Also, need more detail about what type of error
		// NW: we want to bundle here and why.
	}


	var tm_geo = (new Date).getTime();
	// NW: non-descriptive var name tm_geo
	// NW: style - use lowerCamelCase
	// NW: bug - parens around (new Date)
	// NW: fix:
	// NW:		var tmGeo = new Date.getTime();


	//start with default
	// NW: unnecessary comment
	var collection = Zipcode.collection;

	//calculate the mercator box based on the x,y,z tile coordinates
	// NW: unnecessary comment
	var bbox = mercator.bbox(x, y, z);
	// NW: the `bbox` var is straight out of the docs, but violates the no short
	// NW: var names style guide.  use boundingBox instead.
	var lnglo = parseFloat(bbox[0]), latlo = parseFloat(bbox[1]),
		lnghi = parseFloat(bbox[2]), lathi = parseFloat(bbox[3]);
	// NW: style guide: no multi-line var declarations, always use var per line
	// NW: style guide: use proper indendation
	// NW: use meaningful var names for longitude/latitude vars.


	//make a geojson polygon from the coords
	// NW: style guide - unnecessary comment, this section is not very complex
	var bounding_box =
	// NW: style guide - use lowerCamelCase for var names
	{
		type: "Polygon",
		coordinates: [[[lnglo,latlo], [lnglo,lathi], [lnghi,lathi], [lnghi,latlo], [lnglo,latlo]]]
	};

	var find = {
		geometry: {
			$geoIntersects: {
				$geometry: bounding_box
			}
		}
	};
	// NW: why the dollar-signs in the var names? this isn't jquery
	// NW: style - no unnecessary symbols in var names


	//do an intersection query on the spatial bounding box of the tile
	// NW: possible unnecessary comment.
	collection.find(find, { limit: 100, maxTimeMS: 2000 }).toArray(function(err, shapes)
	// NW: style guide - always name anonmous functions ^^
	{
		if(err)
		{
			if(err.code === 50)
				console.warn('zipcodes timeout:', z, x, y);
			else
				console.error(err);

			return res.send(500, err);
		}


		var ms_geo = ((new Date).getTime() - tm_geo);
		// NW: Bug. parens around (new Date), should be
		// NW: `var msGeo = new Date.getTime() - tmGeo);``
		// NW: style guide - use lowerCamelCase for var names
		// NW: style guide - use meaningful var names

		if(ms_geo > 100)
			console.warn('zipcodes geo:', ms_geo + 'ms', z, x, y);


		var ret = [];
		// NW: style guide - use meaningful var names. what does this represent?

		for(var i = 0; i < shapes.length; i++)
		{
			var shape = shapes[i];

			if(!shape.geometry)
				continue;

			if(tolerances[z])
				shape.geometry = gj.simplify(shape.geometry, tolerances[z]);
				// NW: `gj` - use meaningful var names like geojson.

			ret.push([
				shape._id,
				shape.properties.Name,
				shape.geometry.type,
				shape.geometry.coordinates
			]);
		}

		res.json(ret);
		// NW: style guide - use meaningful var names.
		// NW: use `response` instead of `res`.

		//proceed to next stage which saves cache
		// NW: possible unnecessary comment.
		next();
	});
};
