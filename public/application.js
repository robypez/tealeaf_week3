$(document).ready(function() {
  $("#bet_value").keyup(function(e){
    $.ajax({
      url : '/bet_validate',
      type: 'POST',
      data : $(this).serializeArray(),
      success:function(data, textStatus, jqXHR) 
      {
          if(data.validate) {
             $(":submit").removeAttr( "disabled" );
            } 
            else {
             $(":submit").attr( "disabled", "disabled" );
            }
      },
      error: function(jqXHR, textStatus, errorThrown) 
      {
          //if fails      
      }
    });
    e.preventDefault();
  });

  $(document).on("click", "form#player_hit input", function(e) {
     e.preventDefault();
    $.ajax({
      url : '/game/player/hit',
      type: 'POST',
      success:function(data, textStatus, jqXHR) 
      {
          $( '#game_table' ).replaceWith( data );
      },
      error: function(jqXHR, textStatus, errorThrown) 
      {
          //if fails      
      }
    });
    
  });

  $(document).on("click", "form#player_stay input", function(e) {
    e.preventDefault();
    $.ajax({
      url : '/game/player/stay',
      type: 'POST',
      success:function(data, textStatus, jqXHR) 
      {
          $( '#game_table' ).replaceWith( data );
      },
      error: function(jqXHR, textStatus, errorThrown) 
      {
          //if fails      
      }
    });
    
  });

  $(document).on("click", "form#dealer_hit input", function(e) {
     e.preventDefault();
    $.ajax({
      url : '/game/dealer/hit',
      type: 'POST',
      success:function(data, textStatus, jqXHR) 
      {
          $( '#game_table' ).replaceWith( data );
      },
      error: function(jqXHR, textStatus, errorThrown) 
      {
          //if fails      
      }
    });
    
  });

});