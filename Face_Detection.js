// Sets Misty's arms and head to a neutral position, and prints a debug
// message that the movement is underway.
misty.Debug("Moving arms and head to neutral position");
_timeoutToNormal();

// Starts Misty's face detection process, so we can register for
// (and receive) FaceRecognition event messages.
misty.StartFaceDetection();

// Sets up our FaceRecognition event listener.
function registerFaceDetection() {
    // Creates a property test for FaceDetect event messages to check
    // whether the message has a "PersonName" value before passing
    // the event message into the callback.
    misty.AddPropertyTest("FaceDetect", "PersonName", "exists", "", "string");
    // Registers a new event listener for FaceRecognition events. (We
    // call this event listener FaceDetect, but you can use any name
    // you like. Giving event listeners a custom name means you can
    // create multiple event listeners for the same type of event in a
    // single skill.) Our FaceDetect event listener has a debounce of
    // 1000 ms, and we set the fourth argument (keepAlive) to true,
    // which tells the system to keep listening for FaceDetect events
    // after the first message comes back.
    misty.RegisterEvent("FaceDetect", "FaceRecognition", 1000, true);
}

function sendPicture() { 
    misty.Debug("Sending Image to User");
    // Sets up thee JSON body for the Twilio SMS API.
    // Includes the phone number of the recipient and
    // the URL for their photograph on Imgur
    var jsonBody = {
        'Body': '[••] Greetings from Misty!',
        'From': '<number-to-send-from>',
        'To': misty.Get("contact"),
        'MediaUrl': misty.Get("imageLink")
    };


    // Sends a request to the Twilio API with our account
    // credentials to send the picture to the person who asked for it
    var credentials = "<base64-encoded-Twilio-credentials>"
    misty.SendExternalRequest("POST", "https://api.twilio.com/2010-04-01/Accounts/<account-id>/Messages.json", "Basic", credentials, JSON.stringify(jsonBody), false, false, "", "application/x-www-form-urlencoded");
}

// Defines how Misty should respond to FaceDetect event messages. Data
// from each FaceDetect event is passed into this callback function.
function _FaceDetect(data) {

    if (data.PropertyValue == "unknown person"){
        misty.TakePicture("Intruder.jpg", 1920, 1080, true);
        misty.ChangeLED(255, 0, 0);
        misty.PlayAudio("Siren-SoundBible.com-1094437108", 10);
        misty.MoveArmDegrees("both", -80, 100);
        misty.DisplayImage("e_Anger.jpg");
    
    } else {

        // Prints a debug message with FaceDetect event data
    misty.Debug(JSON.stringify(data));
    misty.ChangeLED(0, 255, 0); // Changes LED to green
    misty.PlayAudio("s_Joy.wav", 100);
    misty.DisplayImage("e_Joy.jpg"); // Displays happy eyes
    misty.MoveArmDegrees("both", -80, 100); // Raises both arms
    }

    // Registers for a timer event to invoke the _timeoutToNormal
    // callback function after 5000 milliseconds.
    misty.RegisterTimerEvent("timeoutToNormal", 5000, false);
    
}

registerFaceDetection();

// Sets Misty's arms, head, LED, and display image to a neutral
// configuration.
function _timeoutToNormal() {
    misty.Pause(100);
    misty.MoveHeadDegrees(0, 0, 0, 40); // Faces head forward
    misty.MoveArmDegrees("both", 70, 100); // Lowers arms
    misty.ChangeLED(148, 0, 211); // Changes LED to purple
    misty.DisplayImage("e_DefaultContent.jpg"); // Show default eyes
}