export const state = () => ({
	downScale: 1,
	isMobile: window.matchMedia("(pointer: coarse)").matches,
	audio: null
})

export const getters = {
	getDownScale(state) {
		return state.downScale
	},

	getAudio(state) {
		return state.audio
	}
}

export const mutations = {
	setDownScale(state, payload) {
		state.downScale = payload
	},

	setAudio(state, payload){
		state.audio = payload
	},

	setAudioTimecode(state, payload){
		state.audio.currentTime = payload
	}
}

