// Code review by Nils Whitmont <nils.whitmont@gmail.com>

// 1. what does this file do?
// NW: This appears to be a library function file.  If so, the functions should
// NW: be exported so they can be required/imported and used in other files.

// 2. how does this file fit into an application/server?
// NW: Handles some analytics code, handles events when user clicks on map in
// NW: the web client, gets data and puts it on the map.

// 3. how would you improve the code?
// NW: provide context. explain the intent of these functions with JSDoc style
// NW: comments.

// 4. are there any bugs?
// NW: see inline comments.

// NW: use JSDoc comments here
function runMultiTransactionBuyers()
{
	console.log('running multi transaction buyers');

	api['analytics'].read('multi_transaction_buyers', data.geo_query).done(gotMultiTransactionBuyers);
}

// NW: use use JSDoc comments here
function gotMultiTransactionBuyers(owners)
{
	//delete existing markers, where applicable
	// NW: possible unnecessary comment
	clearMarkers(data.multi_transaction_buyers);

	data.multi_transaction_buyers = [];


	//let's just be lazy and re-process the whole batch
	// NW: possible unnecessary comment
	for(var name in owners)
	{
		var row = owners[name];

		row['name'] = name;

		// NW: Bug - use var keyword when declaring local vars. this statement
		// NW: unnecessarily creates a global variable.
		marker = new google.maps.Marker(
		{
			'position': { 'lat': row['lat'], 'lng': row['lng'] },
			'icon': markers.multi_transaction_buyer,
			'zIndex': 1000
		});

		//cross-link
		// NW: unnecessary comment, be more descriptive.
		marker['multi_transaction_buyer'] = row;
		row['marker'] = marker;

		marker.addListener('click', clickMultiTransactionalBuyer);

		if(!$('#toggle-multi-transaction-buyers').prop('checked'))
			marker.setVisible(false);

		marker.setMap(map);

		//add to list
		// NW: unnecessary comment
		data.multi_transaction_buyers.push(row);
	}
}

// NW: use JSDoc comments here
function clickMultiTransactionalBuyer()
{
	var row = this['multi_transaction_buyer'];

	if(!row) return;


	// NW: unnecessary two empty lines between code statements
	var popupContent = '<div class="popup-multi-transaction-buyer">';
	// NW: unnecessary empty lines between statements.
		popupContent += '<a class="name" href="#/owners/' + encodeURIComponent(row['name'].trim()) + '">' + row['name'].trim() + '</a>';

		popupContent += '<div class="num-properties-owned"><label>Properties Owned:</label> <strong>' + row['num_properties_owned'] + '</strong></div>';

	popupContent += '</div>';
	// NW: use proper indentation here



	//close an open info window
	// NW: unnecessary comment.
	if(infowindow)
	{
		infowindow.close();
		infowindow = null;
	}

	infowindow = new google.maps.InfoWindow({ 'content': popupContent });
	// NW: style guide - use lowerCamelCase --> `infoWindow`
	infowindow.open(map, this);
}
