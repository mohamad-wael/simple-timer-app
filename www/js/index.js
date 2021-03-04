
document .addEventListener ('deviceready' , onDeviceReady , false);
document .addEventListener ("pause" , onPause , false);
document .addEventListener ("resume" , onResume , false);


function 
        onDeviceReady 
            ( ){
    theTimers = buildTimers ( );
    theTimers .onResume ( ); }

function 
        onPause 
            ( ){
    theTimers .onPause ( ); }

function 
        onResume ( ){
    theTimers .onResume ( ); }
