URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

// ボタンの要素を取得
var controls = document.getElementById("controls");
controls.addEventListener("click", startGuitarRecording, false);

/////////////////////////////////////////////// startGuitarRecordingを定義 ///////////////////////////////////////////////
function startGuitarRecording() {
	console.log("recordGuitarButton clicked");

    var constraints = { audio: true, video:false }

 	/*
    	Disable the record button until we get a success or fail from getUserMedia()
	*/

	document.getElementById("recStopText").innerHTML = "STOP";
	console.log("1");

	var element1 = document.getElementById('controls');
	element1.classList.remove("buttonRec");
	// console.log(element1);
	element1.classList.add("buttonStop"); // クラス名の追加

	var element2 = document.getElementById('recStopText');
	element2.classList.remove("innerTextRec");
	element2.classList.add("innerTextStop"); // クラス名の追加
	console.log("2");

	// ////////////////////// なんとなくここにいれたらうまくいったが実際どう？
	// document.getElementById("controls").setAttribute("id","controls2");
	// console.log(document.getElementById("controls").setAttribute("id","controls2"));

	console.log("3");


		//　これで音声録音許可され、開始される
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		audioContext = new AudioContext();

		console.log("4");

		//サンプリング周波数を表示(いる？)

		/*  assign to gumStream for later use  */
		gumStream = stream;

		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
		console.log("5");
		/*
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
		// 2 channel録音にすることも可能
		rec = new Recorder(input,{numChannels:1})

		//start the recording process
		rec.record()

		console.log("Recording started");

	}).catch(function(err) { //ここがないとエラーが出る
	});
}

// 2回目ボタンを押したら、STOP → Recording Vocalになるようにしたい
var controls = document.getElementById("controls");
controls.addEventListener("click", startGuitarRecording, false);

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////// stopGuitarRecordingを定義 ///////////////////////////////////////////////

function stopGuitarRecording() {
	console.log("stopGuitarButton clicked");
	console.log("6");
	rec.stop();

	document.getElementById("recStopText").innerHTML = "Recording Vocal";
	var element3 = document.getElementById('controls2');
	element3.classList.remove("buttonStop");
	element3.classList.add("buttonRec"); // クラス名の追加
	console.log("7");
	var element4 = document.getElementById('recStopText');
	element4.classList.remove("innerTextStop");
	element4.classList.add("innerTextRec"); // クラス名の追加

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();
	console.log("8");
	//create the wav blob and pass it on to createDownloadLink
	// tomiyama created
	rec.exportWAV(saveToServer);
	console.log("9");
}

// /////////////////////////////////////////////// startVocalRecordingを定義 ///////////////////////////////////////////////
//
// function startVocalRecording() {
// 	console.log("recordVocalButton clicked");
//
// 	/*
// 		Simple constraints object, for more advanced audio features see
// 		https://addpipe.com/blog/audio-constraints-getusermedia/
// 	*/
//
//
//
//     var constraints = { audio: true, video:false }
//
// 		// // 様々なパラメーターを追加する方法の案 // Added by Takizawa
// 		// Using Audio Constraints With getUserMedia()
// 		// var constraints = {
// 		//     audio: {
// 		//         sampleRate: 48000,
// 		//         channelCount: 2,
// 		//         volume: 1.0
// 		//     },
// 		//     video: true
// 		// }
// 		// navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
// 		//     /* use the stream */
// 		// }).catch(function(err) {
// 		//     /* handle the error */
// 		// });
//
//  	/*
//     	Disable the record button until we get a success or fail from getUserMedia()
// 	*/
//
// 	recordGuitarButton.disabled = true;
// 	stopGuitarButton.disabled = true;
// 	recordVocalButton.disabled = true;
// 	stopVocalButton.disabled = false;
// 	// Removed by Takizawa
// 	// pauseButton.disabled = false;
//
// 	/*
//     	We're using the standard promise based getUserMedia()
//     	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
// 	*/
//
//
//
// 		//　これで音声録音許可され、開始される
// 	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
// 		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
//
// 		/*
// 			create an audio context after getUserMedia is called
// 			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
// 			the sampleRate defaults to the one set in your OS for your playback device
// 		*/
// 		audioContext = new AudioContext();
//
// 		//サンプリング周波数を表示
// 		document.getElementById("formats").innerHTML="サンプリング周波数 "+audioContext.sampleRate/1000+"kHz"
//
// 		/*  assign to gumStream for later use  */
// 		gumStream = stream;
//
// 		/* use the stream */
// 		input = audioContext.createMediaStreamSource(stream);
//
// 		/*
// 			Create the Recorder object and configure to record mono sound (1 channel)
// 			Recording 2 channels  will double the file size
// 		*/
// 		// 2 channel録音にすることも可能
// 		recvocal = new Recorder(input,{numChannels:1})
//
// 		//start the recording process
// 		recvocal.record()
// 		//play guitar sound
// 		rec.exportWAV(playGuitarSound);
//
// 		console.log("Recording started");
//
// 	}).catch(function(err) {
// 	  	//enable the record button if getUserMedia() fails
// 			recordGuitarButton.disabled = false;
// 			stopGuitarButton.disabled = true;
// 			recordVocalButton.disabled = true;
// 			stopVocalButton.disabled = true;
// 			// Deleted by Takizawa
//     	// pauseButton.disabled = true
// 	});
// }
//
// // // Deleted by Takizawa
// // function pauseRecording(){
// // 	console.log("pauseButton clicked rec.recording=",rec.recording );
// // 	if (rec.recording){
// // 		//pause
// // 		rec.stop();
// // 		pauseButton.innerHTML="Resume";
// // 	}else{
// // 		//resume
// // 		rec.record()
// // 		pauseButton.innerHTML="Pause";
// //
// // 	}
// // }
