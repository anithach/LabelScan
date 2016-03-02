   $(function() {
	
      // Cycles to the previous item
      $(".prev-slide").click(function() {
         $("#myCarousel").carousel('prev');
      });
      
      // Cycles to the next item
      $(".next-slide").click(function() {
         $("#myCarousel").carousel('next');
      });
      
      // Cycles the carousel to a particular frame 
      $(".slide-one").click(function() {
         $("#myCarousel").carousel(0);
      });
      
      $(".slide-two").click(function() {
         $("#myCarousel").carousel(1);
      });
      
      $(".slide-three").click(function() {
         $("#myCarousel").carousel(2);
      });
   });