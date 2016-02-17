$(document).ready(function() {
	function format ( d ) {
	    // `d` is the original data object for the row
	    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
	        '<tr>'+
	            '<td>Product number:</td>'+	          	            
	            '<td>'+d.ponum+'</td>'+
	            '</td>'+
	        '</tr>'+
	        '<tr>'+
	            '<td>Extra info:</td>'+
	            '<td>And any further details here (images etc)...</td>'+
	        '</tr>'+
	    '</table>';
	}	
	
    var table = $('#example').DataTable( {
        ajax: {
            url: "/get/json",
            datatype: 'json',
            dataSrc: ""
        },
        "order": [[ 2, "desc" ]],
        "columns": [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
	        { data : "ponum" ,defaultContent: '-'},
	        { data : "submit_date" ,defaultContent: '-',
	        	"render": function (data) {
	                var date = new Date(data);
	                var month = date.getMonth() + 1;
	                return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
	            }},
	        { data : "code" ,defaultContent: '-'},
	        { data : "proddate" ,defaultContent: '-',
	        	"render": function (data) {
	                var date = new Date(data);
	                var month = date.getMonth() + 1;
	                return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
	            }},
	        { data : "corigin" ,defaultContent: '-'},       
	        { data : "company",defaultContent: '-'},
	        {
	            "data": null, // can be null or undefined
	            "defaultContent": '<button id="qrcodeGenBtn" type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#qrCodeModal">View QR Code</button>'
	         },
        ]
    } );
    
    // Add event listener for opening and closing details
    $('#example tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );
    
    
    $('#example tbody').on( 'click', 'tr', function () {
    	var table = $('#example').DataTable();     
    	$('#bqcode').text(table.row( this ).data().bqcode); 
    	myQRCode = document.getElementById("bqcode");
    	console.log(myQRCode.innerHTML);
    	$('#qrcodeholder canvas').remove();		    		   		
    	//QRcode generation for div qrcodeholder							
   		 $('#qrcodeholder').qrcode({
   			 width: 150,
			 height: 150,
			 text: myQRCode.innerHTML
		});
    });

	//Download QR code image on qrcodeDwnLdBtn click		
	$("#qrcodeDwnLdBtn").click(function () {
		var canvas = $('#qrcodeholder canvas');
		var img = canvas.get(0).toDataURL("image/png");		
		var dl = document.createElement('a');
	   	dl.setAttribute('href', img);
	   	dl.setAttribute('download', 'qrcode.png');
	   	// simulate a click will start download the image, and name is qrcode.png.
	  	 dl.click();
   });    

});			