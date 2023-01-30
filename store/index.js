export const state = () => ({
	downScale: 2
})

export const getters = {
	getCounter(state) {
		return state.downScale
	}
}

export const mutations = {
	setDownscale(state, payload) {
		state.downScale = payload
	}
}

