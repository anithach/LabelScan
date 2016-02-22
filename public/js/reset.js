(function($,W,D)
		{
		    var JQUERY4U = {};

		    JQUERY4U.UTIL =
		    {
		        setupFormValidation: function()
		        {
		            //form validation rules
		            $("#reset-form").validate({
			                onfocusout: false,
			                invalidHandler: function(form, validator) {
			                    var errors = validator.numberOfInvalids();
			                    if (errors) {
			                        validator.errorList[0].element.focus();
			                    }
			                },		                	
		            		rules: {
		                    password: {
		                        required: true,
		                        minlength: 5
		                    }
		                },
		                messages: {
		                    password: {
		                        required: "Please provide a password.",
		                        minlength: "Your password must be at least 5 characters long."
		                    }
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