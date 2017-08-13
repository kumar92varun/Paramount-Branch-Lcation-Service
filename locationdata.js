var website_name = 'http://www.paramountcoaching.org';

var autocompleteSearch;
var BaseLocation = {};
var locationMetadata = {};
var geocoder = new google.maps.Geocoder();

$(document).ready(function(){
	autocompleteSearch = new google.maps.places.Autocomplete((document.getElementById('locationNameT')),{});
	autocompleteSearch.addListener('place_changed', autocompleteSearch_PlaceChanged);

	$(document).on('click', '#savelocationDetailsB', function(){
		var temp;
		locationMetadata['location_type'] = $("[name='locationTypeN']:checked").val();
		

		temp = $("[name='locationCapacityN']:checked").val();
		if(temp == '')
		{
			locationMetadata['capacity'] = '';
		}
		else
		{
			locationMetadata['capacity'] = $("#locationCapacityT").val();
		}
		

		locationMetadata['opening_days'] = $("[name='locationOpeningDaysN']:checked").val();
		

		temp = $("[name='locationTimingsN']:checked").val();
		locationMetadata['timings'] = temp;
		if(temp == 'specific')
		{
			locationMetadata['timings_start'] = $("#locationTimingsStartTime").val();
			locationMetadata['timings_end'] = $("#locationTimingsEndTime").val();
		}
		

		locationMetadata['valet'] = $("[name='valetAvailableN']:checked").val();
		

		temp = $("[name='locationRates4WheelerN']:checked").val();
		if(temp == 'known')
		{
			locationMetadata['wheelerlocationrates4'] = $("#locationRates4Wheeler").val();
		}
		else
		{
			locationMetadata['wheelerlocationrates4'] = "";
		}


		temp = $("[name='locationRates2WheelerN']:checked").val();
		if(temp == 'known')
		{
			locationMetadata['wheelerlocationrates2'] = $("#locationRates2Wheeler").val();
		}
		else
		{
			locationMetadata['wheelerlocationrates2'] = "";
		}
		


		$.ajax({
			type:'POST',
			url:website_name+'/crm/save/locationdata',
			data:{json_data:JSON.stringify(locationMetadata)},
			success:function(message)
			{
				alert("Data Saved.");
			}
		});
	});
});



function autocompleteSearch_PlaceChanged()
{
	ResetAvailableInformationDiv();
	$("#availablelocationInformationDiv").html("<div class='row text-center'>Please Wait...searching Database...</div>");
	var place = autocompleteSearch.getPlace();
	locationMetadata = {};
	locationMetadata['place_id'] = place.place_id;
	locationMetadata['name'] = place.name;
	locationMetadata['longitude'] = place.geometry.location.lng();
	locationMetadata['latitude'] = place.geometry.location.lat();
	locationMetadata['lnglat'] = '('+place.geometry.location.lng()+','+place.geometry.location.lat()+')';
	locationMetadata['address'] = place.formatted_address;

	var geocoderRequest = {};
	geocoderRequest = {placeId:locationMetadata['place_id']};
	geocoder.geocode(geocoderRequest, function(result, status){
		if(status == 'OK')
		{
			for(i=0; i<result.length; i++)
			{
				for(j=0; j<result[i].address_components.length; j++)
				{
					if(result[i].address_components[j].types.indexOf('postal_code') > -1)
					{
						locationMetadata['pincode'] = result[i].address_components[j].long_name;
						break;
					}
					else
					{
						locationMetadata['pincode'] = "";
					}
				}
			}
		}
		else
		{
			alert("Could not load searched place's pincode");
			locationMetadata['pincode'] = "";
		}
	});

	LoadInfoFromDB();
}
function LoadInfoFromDB()
{
	$.ajax({
		type:'POST',
		url:website_name+'/servweb/loadthislocationinfo',
		data:{place_id:locationMetadata['place_id']},
		success:function(message)
		{
			var message_array = $.parseJSON(message);
			if(message_array['status'] == "1")
			{
				locationMetadata = {};
				locationMetadata = message_array;
				$("#availablelocationInformationDiv").html("<div class='row text-center'>This location is found in Database with Metadata previously Entered.</div>");
				FillAvailableInformationDiv();
			}
			else
			{
				if(message_array['status'] == "2")
				{
					$("#availablelocationInformationDiv").html("<div class='row text-center'>This location is found in Database, but no Metadata exists for this location.</div>");
					ResetAvailableInformationDiv();
					$("#changelocationInformationDiv").show();
				}
				else
				{
					if(message_array['status'] == "0")
					{
						locationMetadata = {};
						$("#availablelocationInformationDiv").html("<div class='row text-center' style='color:red;'>This location is not found in Database.</div>");
						ResetAvailableInformationDiv();
					}
				}
			}
		}
	});
}
function FillAvailableInformationDiv()
{
	var html_code = "";
	html_code += "<div class='row'>Google Place ID : <b>"+locationMetadata.place_id+"</b></div>";
	html_code += "<div class='row'>Name : <b>"+locationMetadata.name+"</b></div>";
	html_code += "<div class='row'>Address : <b>"+locationMetadata.address+"</b></div>";
	html_code += "<div class='row'>(Longitude, Latitude) : <b>"+locationMetadata.lnglat+"</b></div>";
	$("#availablelocationInformationDiv").append(html_code);


	$("[name='locationTypeN'][value="+locationMetadata.location_type_id+"]").prop('checked', true);
	if(locationMetadata['capacity'].length == 0)
	{
		$("#capacityNotKnownN").prop('checked', true);
	}
	else
	{
		$("#capacityKnownN").prop('checked', true);
		$("#locationCapacityT").val(locationMetadata['capacity']);
	}
	$("[name='locationOpeningDaysN'][value='"+locationMetadata.days+"']").prop('checked', true);
	if(locationMetadata.timing.length == 0)
	{
		$("#locationTimingsNotKnown").prop('checked', true);
	}
	else
	{
		if(locationMetadata.timing == "24 Hours")
		{
			$("[name='locationTimingsN'][value='"+locationMetadata.timing+"']").prop('checked', true);
		}
		else
		{
			if(locationMetadata.timing == "specific")
			{
				$("#locationTimingsSpecific").prop('checked', true);
				$("#locationTimingsStartTime").val(locationMetadata.start_timing);
				$("#locationTimingsEndTime").val(locationMetadata.end_timing);
			}
		}
	}
	$("[name='valetAvailableN'][value='"+locationMetadata.valet+"']").prop('checked', true);
	if(locationMetadata.four_wheeler.length == 0)
	{
		$("#locationRates4WheelerNotKnownN").prop('checked', true);
	}
	else
	{
		$("#locationRates4WheelerKnownN").prop('checked', true);
		$("#locationRates4Wheeler").val(locationMetadata.four_wheeler);
	}
	if(locationMetadata.two_wheeler.length == 0)
	{
		$("#locationRates2WheelerNotKnownN").prop('checked', true);
	}
	else
	{
		$("#locationRates2WheelerKnownN").prop('checked', true);
		$("#locationRates2Wheeler").val(locationMetadata.two_wheeler);
	}

	$("#changelocationInformationDiv").show();
}


function ResetAvailableInformationDiv()
{
	$("#notKnownN").prop('checked', true);
	$("#capacityNotKnownN").prop('checked', true);
	$("#locationCapacityT").val("");
	$("#locationOpeningDaysNotKnown").prop('checked', true);
	$("#locationTimingsNotKnown").prop('checked', true);
	$("#locationTimingsStartTime").val("");
	$("#locationTimingsEndTime").val("");
	$("#valetAvailableNotKnown").prop('checked', true);
	$("#locationRates4WheelerNotKnownN").prop('checked', true);
	$("#locationRates4Wheeler").val("");
	$("#locationRates2WheelerNotKnownN").prop('checked', true);
	$("#locationRates2Wheeler").val("");

	$("#changelocationInformationDiv").hide();
}