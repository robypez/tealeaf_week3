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

  $('#name input').blur(function()
    {
        
        if( !$(this).val() ) {
             $(":submit").attr( "disabled", "disabled" );
            } 
            else {
            $(":submit").removeAttr( "disabled" );
            }

       
    });

  $('form#hit').submit(function(e){
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
    e.preventDefault();
  });

  $('form#dealer_hit').submit(function(e){
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
    e.preventDefault();
  });

});