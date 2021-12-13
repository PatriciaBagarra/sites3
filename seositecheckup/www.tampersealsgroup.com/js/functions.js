function win_open(href, width, height)
{
	if (width == '' && height == '')  
	{
		window.open(href, '_blank', 'toolbar=no,location=no,status=yes,menubar=no,personalbar=no,scrollbars=yes,resizable=yes,screenx=50,left=50,screenY=50,top=50');
	} 
	else
	{
		window.open(href, '_blank', 'toolbar=no,location=no,status=yes,menubar=no,personalbar=no,scrollbars=yes,width=' + width + ',height=' + height + ',resizable=yes,screenx=50,left=50,screenY=50,top=50')
	}
}

function openPage(href) {
	if(href!=""){
		window.open(href, '_blank', 'width="800",height="600",toolbar=yes,location=yes,status=yes,menubar=yes,personalbar=yes,scrollbars=yes,resizable=yes,screenx=50,left=50,screenY=50,top=50');
	}
}
function openPageLarger(href) {
	if(href!=""){
		window.open(href, '_blank', 'toolbar=yes,location=yes,status=yes,menubar=yes,personalbar=yes,scrollbars=yes,resizable=yes,screenx=50,left=50,screenY=50,top=50');
	}
}

function openPageLargerMrTed(href) {
	if(href!=""){
	
		(href.substr(0,5)!="corp-")?window.open(href, '_blank', 'toolbar=yes,location=yes,status=yes,menubar=yes,personalbar=yes,scrollbars=yes,resizable=yes,screenx=50,left=50,screenY=50,top=50'):window.location=href.substr(5,href.length);
	}
}

function openPageLargerMrTedSpont(href) {
	if(href!=""){
	
		(href.indexOf("spont")==-1)?window.open(href, '_blank', 'toolbar=yes,location=yes,status=yes,menubar=yes,personalbar=yes,scrollbars=yes,resizable=yes,screenx=50,left=50,screenY=50,top=50'):window.location=href.substr(href.indexOf("spont")+6,href.length);
	}
}

function openFullPage(href) {
	if(href!=""){
		var wOptions = "toolbar=yes,location=yes,status=yes,menubar=yes,personalbar=yes," +
			"scrollbars=yes,resizable=yes,outerHeight=" + screen.availHeight + ",outerWidth=" +
			screen.availWidth + ",screenX=0,screenY=0,height=" + screen.availHeight + ",width=" +
			screen.availWidth + ",left=0,top=0";
		window.open(href, '_blank', wOptions);
	}
}

function checkDelete() {

	if (confirm("Do you want to delete this entry?")) {
		return true;
	}
	else {
		return false;
	}
}

function CheckMandatoryFields(oForm) {

	var i, j, sElementName, sElementType, bCheck, sAlertText;
	var bError = 0;
	
	for (i = 0; i < oForm.elements.length; i++) {
		
		oElement = oForm.elements[i];
		sElementName = oElement.name;
		sElementType = oElement.type;

		if (sElementName != "") {
			
			if (sElementName.length > 3) {

				if (sElementName.substr(sElementName.length - 3, 3) == "_mf") {
					
					switch (sElementType) {
					
						case "text":
						
							if (oElement.value == "") {
								bError = 1;
							}
							
							break;
							
						case "checkbox":
						
							if (oElement.checked == false) {
								bError = 1;
							}
							
							break;
							
						case "file":
						
							if (oElement.value != "" && oElement.value.substr(oElement.value.length-3,3) != "doc" && oElement.value.substr(oElement.value.length-3,3) != "pdf") {
								bError = 2;
							}
							
							if (oElement.value == "") {
								bError = 1;
							}
							
							break;
							
						case "select-one":
						
							if (oElement[oElement.selectedIndex].value == "" || oElement[oElement.selectedIndex].value == "null") {
								bError = 1;
							}
							
							break;
							
						case "select-multiple":

							bCheck = 0;

							for (j = 0; j < oElement.options.length; j++) {
								if (oElement.options[j].selected) {
									bCheck++;
								}
							}

							if (bCheck == 0) {
								bError = 1;
							}
							
							break;
					}
				}
			}
		}
		
		if (bError == 0 && oElement.type == "checkbox" && oElement.name == "authorization" && oElement.checked == false){
			bError = 3;
		}
		
		
	}

	if (bError == 0) {
		oForm.submit();
	}
	else {
		
		switch (bError) {
		
			case 1:
				sAlertText="Please fill in all mandatory fields!";
				break;
				
			case 2:
				sAlertText="Only .doc and .pdf attachments are allowed";
				break;
				
			case 3:
				sAlertText="Please check the authorization-box";
				break;
		}
		if(sAlertText.substring(0,1)=="&"){		
			var y=document.createElement('span');
			y.innerHTML=sAlertText;
			alert(y.innerHTML);
		}
		else{	
			alert(sAlertText);
		}
	}
}

function showHide(id) {
    obj = document.getElementById(id);
    if (obj.style.display == 'none'){
    	obj.style.display = 'block';
    }
    else {
    	obj.style.display = 'none';
    }
	
}

var timeoutVar;
function showElement(sLayerName)
{
	if($(sLayerName)){
		$(sLayerName).show();
		hideElementDelayed(sLayerName, 2000);
	}
}

function hideElementDelayed(sLayerName, delay)
{
	timeoutVar = setTimeout("hideElementLight('"+sLayerName+"')",delay);
}

function hideElementLight(sLayerName)
{
	$(sLayerName).hide();
}

function hideElement(sLayerName, event)
{

	var oLayer = document.getElementById(sLayerName);
	if(event.toElement) // IE
	{
		var target = event.target || event.srcElement;
		if(event.toElement.className != "divLayer")
		{
			oLayer.style.display = 'none';
		}
	}
	else // Firefox
	{
		var oChild = event.explicitOriginalTarget;
		var oParent = event.currentTarget;
		if((oChild.className != "divLayer") && (oChild.nodeName != "#text"))
		{
			oLayer.style.display = 'none';
		}
	}
}



sfHover = function() {
	if(document.getElementById("nav")){
		var sfEls = document.getElementById("nav").getElementsByTagName("LI");
		for (var i=0; i<sfEls.length; i++) {
			sfEls[i].onmouseover=function() {
				this.className+=" sfhover";
			}
			sfEls[i].onmouseout=function() { 
				
				  this.className= this.className.replace(new RegExp(' sfhover\\b'), '');
			}
		

		
			
	}
	
	//added for newsletter sign up popup
	if (document.getElementById("rightTeaserNewsletterContent")) {
		var sfEls = document.getElementById("rightTeaserNewsletterContent");
			
		sfEls.onmouseover=function() {
			this.className+=" sfhover";
		}
		sfEls.onmouseout=function() {
			this.className=this.className.replace(new RegExp(" sfhover\\b"), "");
		}
	}
}


}




if (window.attachEvent) window.attachEvent("onload", sfHover);

function createXMLHttpRequest() {
   try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {}
   try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {}
   try { return new XMLHttpRequest(); } catch(e) {}
   alert("XMLHttpRequest not supported");
   return null;
 }
 
function CheckMandatoryFieldsSF(oForm,oURI) {

				var i, j, sElementName, sElementType, bCheck, sAlertText;
				var bError = 0;
				var setOn = 0; // set exists
				var setCheck = 0; // set validation
	
				for (i = 0; i < oForm.elements.length; i++) {	
					oElement = oForm.elements[i];
					sElementName = oElement.name;
					if(oElement.getAttribute("mandatory")==1 && oElement.value == "")  bError =1;
					if(oElement.getAttribute("mandatory")==1 && oElement.selectedIndex==0)  bError =1;
					if(oElement.getAttribute("mandatory")==3 && oElement.checked==false)  bError =1;
					if(oElement.getAttribute("mandatory")=="set") { // triggers set evaluation
						setOn = 1; // set identified and noted
						if (oElement.value != "") setCheck = 1; // an item from set is selected = valid
					}

					if (oElement.type=="file"){ //attachment validation
					
						if (oElement.value != "" && oElement.value.substr(oElement.value.length-3,3) != "doc" && oElement.value.substr(oElement.value.length-3,3) != "pdf") {
							bError = 2;
						} else if (oElement.value == "") {
							bError = 1;
						}
					}
					if(oElement.getAttribute("mandatory")=="emailv" && oElement.value != "") { // non-mandatory email validation
						if (oElement.value.indexOf(".") <= 2 || oElement.value.indexOf("@") < 1) {bError = 3;}
					}
					
					if(oElement.getAttribute("mandatory")=="emailr") { // mandatory email validation
						if(oElement.value == ""){
							bError = 1;
						} else if (oElement.value.indexOf(".") <= 2 || oElement.value.indexOf("@") < 1) {
							bError = 3;
						}
					}
				} 
				 				
				if (setOn == 1 && setCheck == 0) bError =1; // if set exist and all parts are empty, bError is triggered
				if (bError == 0) {					
					dcsMultiTrack('DCS.dcsuri','/'+oURI+'/thank_you.htm','WT.ti','Thank you','WT.cform','1');
					oForm.submit();
				} else if (bError == 3){ //email error
							alert("Invalid email address supplied");				
				} else if (bError == 2){ //attachment error
							alert("Only .doc and .pdf attachments are allowed");
				} else { //standard error
							alert("Please fill in all mandatory fields!");
				}
		}

// default search text clear
function clearDefault(inputField)
{   
    if (inputField.type == "text") {
        if (inputField.value == "Search Term...")
           {
                inputField.value = "";
                inputField.style.color='';
           }
    }
}

function putDefault(inputField)
{   
    if (inputField.type == "text") {
           if (inputField.value == "")
           {
              inputField.value = "Search Term...";
              inputField.style.color='#aaaaaa';
           }
    }        

}

function SelectAll(id)
{
    document.getElementById(id).focus();
    document.getElementById(id).select();
}

function getWebform(webformID) {
            var currWebform = $('solform');
          	if(currWebform != null) {
               window.location = String(window.location).replace(/\#.*$/, "") + '#solform';
            } else {
              document.forms[webformID].submit();
            }
}
