// Return the value of the "SerialMessage" property in the
// SerialMessage data object
misty.AddReturnProperty("SerialMessage", "SerialMessage");

// Register for SerialMessage events. Set the debounce rate to 0, or
// use the rate defined in the sketch. Set `keepAlive` to `true`, so
// the event does not unregister after the first callback triggers. 
misty.RegisterEvent("SerialMessage", "SerialMessage", 0, true);

function _SerialMessage(data) {    
    try{
        if(data !== undefined && data !== null) {
            var obj = JSON.parse(data.AdditionalResults[0].Message);
            var message = obj.message;
            misty.Debug(message);
        }
    }
    catch(exception) {
        misty.Debug("Exception" + JSON.stringify(exception));
    }
}