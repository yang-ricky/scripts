define([
	'when'
], function (when) {
	var HAS_ENUMERATE_DEVICES = Boolean(navigator.mediaDevices) &&
		typeof navigator.mediaDevices.enumerateDevices === 'function';

	var MP3_DATA_URI = 'data:audio/mpeg;base64,/+OIxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+OIxAAAAANIAAAAAExBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

	var body = document.body;

	function canPlayAudio() {
		return when
			.promise(function (resolve, reject) {
				var audio = document.createElement('audio');
				if (!audio.canPlayType('audio/mpeg')) {
					reject(new Error('cannot play mp3'));
					return;
				}
				audio.addEventListener('error', function (event) {
					if (event.srcElement && event.srcElement.error &&
						event.srcElement.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
						resolve(false);
					} else {
						reject(new Error('Unexpected audio error ' + event));
					}
					body.removeChild(audio);
				});
				audio.addEventListener('play', function () {
					resolve(true);
					body.removeChild(audio);
				});
				audio.autoplay = true;
				audio.src = MP3_DATA_URI;
				body.appendChild(audio);
			});
	}

	function hasAudioOutput() {
		if (HAS_ENUMERATE_DEVICES) {
			return when.resolve()
				.then(function () { // encapsulate in then() to catch exceptions
					return navigator.mediaDevices.enumerateDevices();
				})
				.then(function (devices) {
					return devices.reduce(function (hasOutputDevices, device) {
						return hasOutputDevices || device.kind === 'audiooutput';
					}, false);
				});
		} else {
			return when.resolve();
		}
	}

	return {
		hasAudioOutput: hasAudioOutput,
		canPlayAudio: canPlayAudio
	};
});
