(function($,W,D)
		{
		    var JQUERY4U = {};

		    JQUERY4U.UTIL =
		    {
		        setupFormValidation: function()
		        {
		            //form validation rules
		            $("#forgot-form").validate({
			                onfocusout: false,
			                invalidHandler: function(form, validator) {
			                    var errors = validator.numberOfInvalids();
			                    if (errors) {
			                        validator.errorList[0].element.focus();
			                    }
			                },		                	
		            		rules: {
			                    emailaddress: {
			                        required: true,
			                        email: true
			                    }
		                },
		                messages: {
		                	emailaddress: "Please enter your Email address to reset your password.",
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