export const state = () => ({
	downScale: 1,
	lastDownScale: 1,
	isMobile: window.matchMedia("(pointer: coarse)").matches,
	audioCurrent: null,
	audioBase: null,
	audioEndOne: null,
	audioEndTwo: null,
	audioLoopNeutral: null,
	audioLoopDrumOne: null,
	audioLoopDrumTwo: null,
	badComputer: false,
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

	setBadComputer(state, payload) {
		state.badComputer = payload
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
		payload.playsInline = true;
		state.audioBase = payload
	},

	setAudioEndOne(state, payload){
		payload.playsInline = true;
		state.audioEndOne = payload
	},

	setAudioEndTwo(state, payload){
		payload.playsInline = true;
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
		state.audioCurrent.currentTime = payload
	}
}

