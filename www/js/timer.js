function 
        timer_Controller 
            (mTimerId , mTimerTime_display ){
    let timerId = mTimerId;
    let timerName = "Timer name";
    let timerTime_display = mTimerTime_display;
    let timer_stamp = 0 , 
        appPaused_stamp = 0 , 
        msPaused_total = 0 ,
        state = 0 ;
        /* -1 , timer killed into background  , not important to measure 
         0 , timer paused  
         1 , timer started , is running 
         2 , timer loading from killed  , not important , will be set to 0 or 1 
         3 , timer has been reset  , not important , state set 0 as paused on reset */
    const  countdown_schedule = 100 ; 
    let  intervalId = null;


    function 
            formatTime
                (msTimestamp ){ /* function recieves a timestamp
                and generate hh:mm:ss:ms */
        let hours = Math .floor (msTimestamp / 3600000 );
        msTimestamp = msTimestamp - hours * 3600000 ; 
        let minutes = Math .floor (msTimestamp / 60000 );
        msTimestamp = msTimestamp - minutes * 60000;
        seconds = Math .floor (msTimestamp / 1000 );
        msTimestamp = msTimestamp - seconds * 1000;
        if (hours >= 100) {
            hours = 0;
            minutes = 0;
            seconds = 0;
            msTimestamp = 0 ; }
        let hrStr = hours < 10 ? `0${hours }` : hours;
        let mnStr = minutes < 10 ? `0${minutes }` : minutes;
        let secStr = seconds < 10 ? `0${seconds }` : seconds;
        let msStr = msTimestamp < 10 ? `00${msTimestamp }` : msTimestamp < 100 ? `0${msTimestamp}` : msTimestamp;
        return  `${hrStr}:${mnStr}:${secStr}:${msStr}`; } 

    function 
            displayTime(formated_time ){
        timerTime_display .innerText = formated_time; }

    function 
            startTimer
                ( ){
        if (state == 0 ){//timer is not started 
                        // reset don't care ..
                        // care only about formula to get time
                        // which is :
                        // Timer = NOW - timer_stamp - msPaused_total + msKldTotal
            state = 1;
            theTime ( );/* Display time , 
                           and schedule it every 100 ms */
            intervalId = setInterval ( ( ) => {
                theTime ( ); }, 
                countdown_schedule ); }  

        function 
                theTime
                    ( ){
            if(state == 1 ){
                let NOW = Date .now ( );
                timer_stamp = timer_stamp || NOW;
                //timer_stamp , is already set  , or if this is the first
                // time starting the app , set it to NOW
                if(appPaused_stamp != 0 ){
                    const appPaused_For= NOW - appPaused_stamp ;
                    // HOW much the app is paused 
                    msPaused_total = msPaused_total + appPaused_For;
                    //add this to the total time
                    //in ms the app is pausd 
                    //Once done clear the  app paused timestamp ,
                    //by setting it to 0  .
                    appPaused_stamp = 0;}
                    
                let timerTime = NOW - timer_stamp - msPaused_total ;
                // apply the formula ,
                // TimerTime = NOW - timer_stamp - msPaused_total ;

                displayTime (formatTime (timerTime ) );}}}

    function 
            pauseTimer
                ( ){/* Timer starts paused , If paused clicked  , 
                       must set the appPaused_stamp , clear the 
                       intervalId , set it to null , set the state 
                       to 0 */
        if (state == 1){
            //timer is started 
            let NOW = Date .now();
            state = 0 ; 
            clearInterval(intervalId);
            intervalId = null;
            appPaused_stamp = NOW; } }
    
    function 
            saveTimer ( ){ /* OnPause , applicaton getting ,
                    ready to be killed or in background .*/
       let oldState = state ; 
       state = -1 ;
       if(oldState == 1 ){
           clearInterval (intervalId );
           intervalId = null ;}
        return {
            timerName : timerName,
            timer_stamp : timer_stamp , 
            appPaused_stamp : appPaused_stamp , 
            msPaused_total : msPaused_total ,
            oldState : oldState ,}}

    function 
            loadTimer
                (savedTimer ){ /* The timer is killed , so 
                        state is -1 .*/
       timerName = savedTimer ['timerName' ];
       timer_stamp = savedTimer ['timer_stamp' ] ; 
       appPaused_stamp = savedTimer ['appPaused_stamp' ] ;
       msPaused_total = savedTimer ['msPaused_total' ] ;
       let oldState = savedTimer ['oldState' ];
       state = 0  ;
       if(oldState == 1 ){
            startTimer ( ); }
        else{
            displayTime (formatTime (appPaused_stamp - timer_stamp - msPaused_total ) );}}

    function 
            resetTimer ( ){
        state = 0;
        timer_stamp = 0;
        appPaused_stamp = 0; 
        msPaused_total = 0;
        appKilledStmp  = 0;
        msKldTotal = 0;
        clearInterval(intervalId);
        intervalId = null;
        displayTime (formatTime (0 ) );}

    function 
            show_TimerName_Form 
                (name ){
        name // access the form 
            .previousElementSibling ["input_timerName" ] // access the input
            .classList .remove ( "input_timerName_displayNone" ); //show input
        name
            .previousElementSibling ["input_timerName" ]
            .classList .add ( "input_timerName_display" );
        name
            .previousElementSibling ["input_timerName" ] .focus  (  ); } 
    

    function 
            change_TimerName 
                (input , name  , event ){
        event .preventDefault ( );
        let text = input .value .trim ( );
        if  (text .length != 0 ){
            name .innerText = text;
            timerName = text; }
        input .classList .remove ( "input_timerName_display");
        input .classList .add ( "input_timerName_displayNone"); }

    return {
        getTimerHtml : ()=>timerTime_display.parentElement ,
        getTimerId : ()=>timerId,
        startTimer ,
        pauseTimer ,
        resetTimer ,
        saveTimer ,
        loadTimer ,
        show_TimerName_Form  ,
        change_TimerName  } }


function buildTimer_Interface(timerId , timerName) {
    timerName = timerName || "Timer Name";

    const template = `
<div 
            class = "timer" 
            id = "${timerId }" >
<div 
            class = "timer-nav" >

    <form   
                style = "position : relative;" 
                onSubmit = " theTimers 
                                .getTimer (${timerId } )
                                .change_TimerName (this .firstElementChild , 
                                    this .nextElementSibling  , event ) ">
        <input 
            id = "input_timerName"  
            class = "input_timerName_displayNone" 
            type = "text" 
            maxlength = "22" 
            placeholder = "Timer name"
            onBlur = " theTimers .getTimer (${timerId } )
                        .change_TimerName (this , 
                            this .parentElement .nextElementSibling  , event )"
            >
                    </form> 
                    <!-- Form To change the timer name -->

    <p 
                class = "timer-name" 
                onclick = "theTimers .getTimer (${timerId } )
                            .show_TimerName_Form (this )"> 
        ${timerName }
                 </p>

    <div class = "timer-buttons">
        <span class = "icon-play-alt" 
            onclick = "theTimers .getTimer (${timerId } ) .startTimer ( )"></span>
        <span class = "icon-pause" 
            onclick = "theTimers .getTimer (${timerId }) .pauseTimer ( )"></span>
        <span class = "icon-reload" 
            onclick = "theTimers .getTimer (${timerId }) .resetTimer ( )"></span>
        <span class = "icon-trash-stroke" 
            onclick = "theTimers .deleteTimer (${timerId } )"></span>
                </div>
            </div> <!-- end of timer nav -->

<div class = "timer-time" id = "timer-time-${timerId }">
    00:00:00:000
</div>
</div>
`;
    theTimers .html .insertAdjacentHTML ("beforeend" , template );
    let timerTime_display = document .getElementById (`timer-time-${timerId }` );
    return timerTime_display;
}

function 
        createTimer 
            (timerId , timerName ){
    const timerTime_display =  buildTimer_Interface (timerId , timerName ); 
    const timer =  timer_Controller (timerId , timerTime_display );
    return timer; }
