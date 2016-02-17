(function($,W,D)
		{
		    var JQUERY4U = {};

		    JQUERY4U.UTIL =
		    {
		        setupFormValidation: function()
		        {
		            //form validation rules
		            $("#create-po-form").validate({
			                onfocusout: false,
			                invalidHandler: function(form, validator) {
			                    var errors = validator.numberOfInvalids();
			                    if (errors) {
			                        validator.errorList[0].element.focus();
			                    }
			                },		                	
		            		rules: {
		            		ponum: "required",
		            		prod_date: "required",
		            		prodcode: {
		                        number: true
		                    },
		            		fdaregno: {
		                        number: true
		                    },
		            		traceid: {
		                        number: true
		                    },
		                    prod_date : {
		                    	required : true,
		                    	date: true
		                    }
		                },
		                messages: {
		                	ponum: "Please enter your Purchase Order No.",
		                	prod_date: "Please enter your Production Date",
		                	prodcode: "Please enter a valid Code.",
		                    fdaregno: "Please enter valid FDA Registration No.",
		                    traceid: "Please enter valid Tracebility ID."
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

	$(function() {
        $( "#datepicker" ).datepicker({
            showOn: "button",
            buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif",
            buttonImageOnly: true            
        });
        
	  });