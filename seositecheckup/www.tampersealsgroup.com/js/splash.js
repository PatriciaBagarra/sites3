
function fnOtherSites()
{
	var form = document.forms[0];
	locn = form.elements['countrySelect'].options[form.elements['countrySelect'].selectedIndex].value;
	
	
	
	if (form.elements['countrySelect'].options[form.elements['countrySelect'].selectedIndex].index==0)
	{
		alert("Please select your location");
	}	
	else
	{		
		location.href=locn;
	}
}


var siteurl
siteurl=""


searchcountries = new Array (
["Select your Location",""],
["Hong Kong",siteurl+"/contact-us.htm#hongkong"],
["Russian Federation",siteurl+"/contact-us.htm#Russia"],
["Germany",siteurl+"/contact-us.htm#Germany"],
["United States",siteurl+"/contact-us.htm#USA"],
["Guatemala",siteurl+"/contact-us.htm#Guatemala"],
["Shenzhen",siteurl+"/contact-us.htm#shenzhen"]
);










function fnShowAllCtry( field, formName ) {
	var tmpVal;
	var totalElements = searchcountries.length;
	optElm = document.forms[formName].elements[field];
	for( j = 0 ; j < totalElements ; j++ )
	{
		tmpVal = searchcountries[j][1];
		optElm.options[j] = new Option( searchcountries[j][0], tmpVal );
		if (searchcountries[j][0] == ("Select your Location"))
		{
			optElm.options[j].selected = "true";
		}
	}
}
