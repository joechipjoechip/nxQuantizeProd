export const state = () => ({
	downScale: 1,
	isMobile: window.matchMedia("(pointer: coarse)").matches
})

export const getters = {
	getCounter(state) {
		return state.downScale
	}
}

export const mutations = {
	setDownScale(state, payload) {
		state.downScale = payload
	}
}

