export const state = () => ({
	downScale: 1,
	lastDownScale: 1,
	isMobile: window.matchMedia("(pointer: coarse)").matches,
	audioCurrent: null,
	audioBase: null,
	audioLoop: null,
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

	setAudioLoop(state, payload){
		payload.playsInline = true;
		payload.loop = true;
		state.audioLoop = payload
	},

	setAudioTimecode(state, payload){
		state.audioCurrent.currentTime = payload
	}
}

