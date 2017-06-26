var map;
var map_lnglat;
var location_marker;

$(document).ready(function(){
	$(document).on('click', '#location-B', function(){
		navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationError, {enableHighAccuracy:true});
	});
	$(document).on('click', '#add-marker-B', function(){
		addCurrentLocationMarker();
	});
});


function geoLocationSuccess(position){
	console.log(position);
	map_lnglat = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	renderMap();
}
function geoLocationError(error_object){
	alert('Sorry, we could not find your location.');
	/*
		switch(error_object['code'])
		{
			case 1:
			{
				alert('You denied permission to track your location');
				break;
			}
		}
	*/
}





function renderMap(){
	map = new google.maps.Map(document.getElementById('map'), {
		center:map_lnglat,
		zoom:16
	});
}
function addCurrentLocationMarker(){
	location_marker = new google.maps.Marker({
		position:map_lnglat,
		map:map
	});
}






























































/*


//JaraScript Variable of type Array...
var array_example = [];

array_example[0] = 91;
array_example[1] = 900;
array_example[2] = 'Kartik';
array_example[3] = 'Varun';
array_example[4] = 6.7;
array_example[200] = 'popup';




//JavaScript variable of Object Type...
var object_example = {};
object_example['name'] = 'Kartik';
object_example['age'] = 20;
object_example['address'] = 'Shastri Nagar';
object_example['city'] = 'New Delhi';
object_example['state'] = 'Delhi';



//JavaScript variable of Object Type...
var json_example = {};
var json_example = {'name':'Kartik', 'age':20, 'address':'Shastri Nagar', 'city':'New Delhi', 'state':'Delhi'};

var json_example = {
	'name':'Kartik',
	'age':20,
	'address':'Shastri Nagar',
	'city':'New Delhi',
	'state':'Delhi'
};




var geo_options = {
	enableHighAccuracy: true, 
	maximumAge        : 30000, 
	timeout           : 27000
};



//JSON => JavaScript Object Notation

*/
