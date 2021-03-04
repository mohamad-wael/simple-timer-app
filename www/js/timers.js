function 
        buildTimers 
            ( ){
    let data = { };
    let uuid = 0;
    let html = document .getElementById  ( "theTimers");
    const theTimers_db_key = 'theTimers_db_key';

    function 
            addTimer 
                (name ){
        data [uuid ] = createTimer (uuid , name );
        uuid++;
        return data [uuid - 1 ]; }


    function 
            getTimers 
                ( ){
        return data; }

    function 
            getTimer 
                (timerIndex ){
        return data[timerIndex ]; }


    function 
            deleteTimer 
                (timerId ){
        const timer = theTimers .getTimer (timerId ) ;
        const timerHtml = timer .getTimerHtml ( );
        timer .resetTimer ( );
        theTimers .html .removeChild(timerHtml );
        delete data [timerId ]; }


    function 
            onPause 
                ( ){
        let saved = [ ];
        for  (let timerID in data ){
            saved .push (data [timerID ] .saveTimer ( ) );
            deleteTimer (timerID ); }
        const serialized =  JSON .stringify (saved );
        window .localStorage .setItem 
            (theTimers_db_key , serialized );
         uuid = 0;
         data = { }; }

    function 
            onResume ( ){
        let saved = JSON .parse (window .localStorage .getItem (theTimers_db_key ) );
        for (let index in saved ) {
            addTimer (saved [index ] ["timerName" ] ) .loadTimer (saved [index ] ); }}

    return {
        addTimer ,
        deleteTimer ,
        getTimer ,
        getTimers ,
        onPause  , 
        onResume , 
        html: html } }

function 
        buildTimersInterface 
            ( ){ }