misty.Debug("Moving arms and head to neutral position");
_timeoutToNormal();

// Sets up our FaceRecognition event listener.
function registerFaceDetection() {
    misty.AddPropertyTest("FaceDetect", "PersonName", "exists", "", "string");
    misty.RegisterEvent("FaceDetect", "FaceRecognition", 1000, true);
}

function uploadImage(imageData) {
    // JSON body for picture upload
    var picJSONBody = {
        'image': imageData,
        'type' : 'base64'
    };
    // Token is an oauth2 token that must be generated from your imgur account
    // Using the client id and secret.
    var token = "27206fad190c305ad4149bdab0378ea9d96cb6d9";
    misty.SendExternalRequest("POST", "https://api.imgur.com/3/image", "Bearer", token, JSON.stringify(picJSONBody), false, false, "", "application/json", "_imageUploadResponse");
}

function _imageUploadResponse(responseData) {
    misty.Set("imageLink", JSON.parse(responseData.Result.ResponseObject.Data).data.link, false);
    sendPicture();
}

function _TakePicture(data) {
    var base64String = data.Result.Base64;
    uploadImage(base64String);
}



// Defines how Misty should respond to FaceDetect event messages. Data
// from each FaceDetect event is passed into this callback function.
function _FaceDetect(data) {
    misty.Debug(JSON.stringify(data.PropertyTestResults[0].PropertyValue));
    if (data.PropertyTestResults[0].PropertyValue == "unknown person"){
        misty.TakePicture("intruder", 800, 600, true, true);
        misty.Pause(400);
        misty.ChangeLED(255, 0, 0);
        misty.MoveArmDegrees("both", -80, 100);
        misty.DisplayImage("e_Anger.jpg");
    } else {
        // Prints a debug message with FaceDetect event data
        misty.Debug(JSON.stringify(data));
        misty.ChangeLED(0, 255, 0); // Changes LED to green
        //misty.PlayAudio("s_Joy.wav", 100);
        misty.DisplayImage("e_Joy.jpg"); // Displays happy eyes
        misty.MoveArmDegrees("both", -80, 100); // Raises both arms
    }

    misty.RegisterTimerEvent("timeoutToNormal", 5000, false);
    misty.StopFaceRecognition();
    
}

function _timeoutToNormal() {
    misty.Pause(100);
    misty.MoveHeadDegrees(0, 0, 0, 100); // Faces head forward
    misty.MoveArmDegrees("both", 70, 100); // Lowers arms
    misty.ChangeLED(148, 0, 211); // Changes LED to purple
    misty.DisplayImage("e_DefaultContent.jpg"); // Show default eyes
    misty.StartFaceRecognition();
}

function sendPicture() {
    misty.Debug("Sending Image to Administrator");
    // Sets up thee JSON body for the Twilio SMS API.
    // Includes the phone number of the recipient and
    // the URL for their photograph on Imgur
    var jsonBody = {
        'Body': '[••] Intruder Detected!',
        'From': '+12029373496',
        'To': '+12514426537',
        'MediaUrl': misty.Get("imageLink")
    };

    // Credentials consist of AccountSID:AuthToken base64 encoded.
    var credentials = 'QUM3ZTdjMDZiYTZkMzIxNDMwOWNkYTkxYTkyZWE5ZDU5MTpkMDY3ODlkOWYzMGQwY2UzMjUxMTgzMDIxMTU0ZmZkOA==';
    misty.SendExternalRequest("POST", "https://api.twilio.com/2010-04-01/Accounts/AC7e7c06ba6d3214309cda91a92ea9d591/Messages.json", "Basic", credentials, JSON.stringify(jsonBody), false, false, "", "application/x-www-form-urlencoded");
}

// function _SendExternalRequest(data_response) {
//     misty.Debug(JSON.stringify(data_response));
// }

registerFaceDetection();