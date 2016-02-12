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
		                    email: {
		                        required: true,
		                        email: true
		                    },
		                    password: {
		                        required: true,
		                        minlength: 5
		                    },
		                    company: "required",
		                    emailaddress: "required",
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
		                    emailaddress: "Please enter a valid email address.",
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