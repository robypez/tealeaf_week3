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

  $('form#hit').submit(function(e){
    $.ajax({
      url : '/game/player/hit',
      type: 'GET',
      success:function(data, textStatus, jqXHR) 
      {
          $( '#player_cards div:last' ).before( data );
      },
      error: function(jqXHR, textStatus, errorThrown) 
      {
          //if fails      
      }
    });
    e.preventDefault();
  });

  $('form#stay').submit(function(e){
    $.ajax({
      url : '/game/player/stay',
      type: 'POST',
      success:function(data, textStatus, jqXHR) 
      {
          console.log(data)
      },
      error: function(jqXHR, textStatus, errorThrown) 
      {
          //if fails      
      }
    });
    e.preventDefault();
  });
});