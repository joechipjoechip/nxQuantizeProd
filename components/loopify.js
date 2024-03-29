function loopify(vm, uri, cb) {

	var context = new (window.AudioContext || window.webkitAudioContext)(),
		request = new XMLHttpRequest();

	var intervalID = null;
	var firstTimeStamp = 0;

	context.onstatechange = () => console.log("sonstatechange triggered : ", context.state);

	request.responseType = "arraybuffer";
	request.open("GET", uri, true);

	// XHR failed
	request.onerror = function() {
		cb(new Error("Couldn't load audio from " + uri));
	};

	// XHR complete
	request.onload = function() {
		context.decodeAudioData(request.response, success, function(err){
			// Audio was bad
			cb(new Error("1 Couldn't decode audio from " + uri));
		});
	};

	// context.decodeAudioData(uri, success, function(err){
	// 	// Audio was bad
	// 	cb(new Error("2 Couldn't decode audio from " + uri));
	// });

	request.send();

	function success(buffer) {

		let source;
		const gainNode = context.createGain();

		function volume(newVolume){
			gainNode.gain.value = newVolume
		}

		function play() {

			// Stop if it's already playing
			stop();

			// Create a new source (can't replay an existing source)
			source = context.createBufferSource();
			
			source.connect(gainNode);

			gainNode.connect(context.destination);


			// Set the buffer
			source.buffer = buffer;
			source.loop = true;

			// Play it
			source.start(0);

			handlePlay(source);

		}

		function stop() {

			// Stop and clear if it's playing
			if (source) {
				source.stop();
				source = null;
			}

		}

		cb(null,{ play, stop, volume });

	}

	function handlePlay( source ){

		console.log("handle play : ", context.state);

		if( context.state !== "running" ){
			// source.start(0);
			console.log("not running :/");
			context.resume().then(() => source.start(0));
		}

		// because sometimes, currentTime starts at 17 (dunno why..)
		firstTimeStamp = context.currentTime;
		
		intervalID = setInterval(doAtInterval, 10);
		
	}
	
	function doAtInterval(){

		const realTimeStamp = context.currentTime - firstTimeStamp;
		
		// console.log("realTimeStamp : ", realTimeStamp);

		if( realTimeStamp >= 20 ){
			vm.$nuxt.$emit("please-stop-loop", {})
			clearInterval(intervalID);
		}

	}

};

export { loopify }

// loopify.version = "0.1";

// if (typeof define === "function" && define.amd) {
// 	define(function() { return loopify; });
// } else if (typeof module === "object" && module.exports) {
// 	module.exports = loopify;
// } else {
// 	this.loopify = loopify;
// }

