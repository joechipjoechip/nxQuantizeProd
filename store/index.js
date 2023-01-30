export const state = () => ({
	downScale: 1
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

