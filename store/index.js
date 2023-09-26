export const state = () => ({
	downScale: 1,
	lastDownScale: 1,
	isMobile: window.matchMedia("(pointer: coarse)").matches,
	appleUser: false,
	audioCurrent: null,
	audioBase: null,
	audioEndOne: null,
	audioEndTwo: null,
	audioLoopNeutral: null,
	audioLoopDrumOne: null,
	audioLoopDrumTwo: null,
	badComputer: false,
	veryBadComputer: false,
	currentChoice: null,
	assetsLoadCount: 0
})

export const getters = {
	
	// useless af
	getDownScale(state) {
		return state.downScale
	},

	getAudioCurrent(state) {
		return state.audioCurrent
	}
}

export const mutations = {

	incrementAssetsLoadCount(state) {
		state.assetsLoadCount++
	},

	setCurrentChoice(state, payload) {
		state.currentChoice = payload
	},

	setAppleUser(state, payload){
		state.appleUser = payload
	},

	setBadComputer(state, payload) {
		state.badComputer = payload
	},

	setVeryBadComputer(state, payload) {
		state.veryBadComputer = payload
	},

	setDownScale(state, payload) {
		state.downScale = payload
	},

	setLastDownScale(state, payload) {
		state.lastdDownScale = payload
	},

	setAudioCurrent(state, payload){
		state.audioCurrent = payload
	},

	setAudioBase(state, payload){
		if( payload ) {
			payload.playsInline = true;
		}
		state.audioBase = payload
	},

	setAudioEndOne(state, payload){
		if( payload ) {
			payload.playsInline = true;
		}
		state.audioEndOne = payload
	},

	setAudioEndTwo(state, payload){
		if( payload ) {
			payload.playsInline = true;
		}
		state.audioEndTwo = payload
	},

	setAudioLoopNeutral(state, payload){
		state.audioLoopNeutral = payload
	},

	setAudioLoopDrumOne(state, payload){
		state.audioLoopDrumOne = payload
	},

	setAudioLoopDrumTwo(state, payload){
		state.audioLoopDrumTwo = payload
	},

	setAudioTimecode(state, payload){
		console.log("setAudioTimeCode at ", payload, state.audioCurrent)
		state.audioCurrent.currentTime = payload
	}
}

