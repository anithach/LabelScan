$(document).ready(function() {
	var autocomplete = new google.maps.places.Autocomplete($("#address")[0], {});

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        console.log(place.address_components);
        var components = place.address_components;
        for (var i = 0, component; component = components[i]; i++) {
            console.log(component.types[0] +" - "+component['long_name']);
            if (component.types[0] == 'street_number') {
            	$('input[name="adressLine1"]').val(component['long_name']);                
            }
            if (component.types[0] == 'route') {
            	$('input[name="adressLine2"]').val(component['long_name']);                
            }  
            if (component.types[0] == 'locality') {
            	$('input[name="city"]').val(component['long_name']);                
            }  
            if (component.types[0] == 'administrative_area_level_1') {
            	$('input[name="state"]').val(component['long_name']);                
            }              
            if (component.types[0] == 'country') {
            	$('input[name="country"]').val(component['long_name']);             
            }  
            if (component.types[0] == 'postal_code') {
            	$('input[name="postalCode"]').val(component['long_name']);             
            }             
        }  
    });	
	
	(function($,W,D)
			{
			    var JQUERY4U = {};
	
			    JQUERY4U.UTIL =
			    {
			        setupFormValidation: function()
			        {
			            //form validation rules
			            $("#register-form").validate({
				                onfocusout: false,
				                invalidHandler: function(form, validator) {
				                    var errors = validator.numberOfInvalids();
				                    if (errors) {
				                        validator.errorList[0].element.focus();
				                    }
				                },		                	
			            		rules: {
			                    firstname: "required",
			                    lastname: "required",
			                    emailaddress: {
			                        required: true,
			                        email: true
			                    },
			                    password: {
			                        required: true,
			                        minlength: 5
			                    },
			                    company: "required"		       
	//		                    primaryPhone: "required",
	//		                    adressLine1: "required",
	//		                    adressLine2: "required",
	//		                    city: "required",
	//		                    state: "required",
	//		                    postalCode: "required",
	//		                    country: "required"
			                },
			                messages: {
			                    firstname: "Please enter your First Name.",
			                    lastname: "Please enter your Last Name.",
			                    password: {
			                        required: "Please provide a password.",
			                        minlength: "Your password must be at least 5 characters long."
			                    },
			                    company: "Please enter your Company Name.",
			                    emailaddress:{
			                        required: "Please provide a Email address.",
			                        email: "Please enter a valid Email address."
			                    } 
	//		                    primaryPhone: "Please enter your Primary Phone.",
	//		                    adressLine1: "Please enter your Company Address Line 1.",
	//		                    adressLine2: "Please enter your Company Address Line 2.",
	//		                    city: "Please enter your City.",
	//		                    state: "Please enter your State.",
	//		                    postalCode: "Please enter your Postal Code.",
	//		                    country: "Please enter your Country."
			                },
			                errorContainer: $('#errorContainer'),
			                errorLabelContainer: $('#errorContainer ul'),
			                wrapper: 'li',
			                submitHandler: function(form) {
			                    form.submit();
			                }
			            });
			        }
			    }
	
			    //when the dom has loaded setup form validation rules
			    $(D).ready(function($) {
			        JQUERY4U.UTIL.setupFormValidation();
			    });
	
			})(jQuery, window, document);

});