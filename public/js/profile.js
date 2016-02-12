$(document).ready(function() {
	$('#potable').DataTable({
		"order": [[ 1, "desc" ]],
		  "aoColumnDefs": [
		                   { 
		                       "aTargets": [1], //column index counting from the left
		                       "sType": 'date',
		                       "fnRender": function ( dateObj ) {
		                           var oDate = new Date(dateObj.aData[0]);
		                           result = oDate.getDate()+"/"+(oDate.getMonth()+1)+"/"+oDate.getFullYear();
		                           return "<span>"+result+"</span>";
		                       }
		                   }
		                 ],		
		responsive: {
		details: {
		display: $.fn.dataTable.Responsive.display.childRowImmediate,
		type: ''
		}
		}
	} );		
	myQRCode = document.getElementById("qrocde");
		$('.color-picker').pickAColor({
			showSpectrum            : true,
			showAdvanced            : false,
			showSavedColors         : false,
			saveColorsPerElement    : false,
			fadeMenuToggle          : true,
			showHexInput            : true,
			showBasicColors         : true,
			allowBlank              : false,
			inlineDropdown          : false
	});		
	$("#qrcodeGenBtn").click(function () {
		$('#qrcodeholder canvas').remove();		
		var qrCodeWidth = '150';
		var qrCodeHeight = '150';
		var imageSizeVal = $( "#imageSize" ).val();	
		if(imageSizeVal === 'medium'){		
			qrCodeWidth = '250';
			qrCodeHeight = '250';
		}else if(imageSizeVal === 'large'){
			qrCodeWidth = '350';
			qrCodeHeight = '350';
		}
		//QRcode generation for div qrcodeholder							
		$('#qrcodeholder').qrcode({
			text	: myQRCode.innerHTML,
			render	: "canvas",  // 'canvas' or 'table'. Default value is 'canvas'
			background : "#000000",
			foreground : "#ffffff",
			width : qrCodeWidth,
			height: qrCodeHeight
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