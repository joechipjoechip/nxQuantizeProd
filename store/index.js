
// mac_vieux_safari: 	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15"
// mac_vieux_chrome : 	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
// mac_new_safari : 	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
// iphone_safari : 	"Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"


export const state = () => ({
	downScale: 1,
	lastDownScale: 1,
	isMobile: window.matchMedia("(pointer: coarse)").matches,
	appleUser: false,
	audioCurrent: null,
	audioBase: null,
	audioEndOne: null,
	audioEndTwo: null,
	badComputer: false,
	veryBadComputer: false,
	currentChoice: "One",
	assetsLoadCount: 0,
	endedAudios: false,
	choiceIsDisplayed: false,
	choiceHaveBeenMade: false,
	choiceHaveBeenMadeTimeCode: 55.5,
	choiceChangedCounter: 0,
	finishBegan: false,
	currentSequenceInfos: {},
	mobileBlurCurtainIsDisplayed: false
})

export const getters = {
	
	// useless af
	getDownScale(state) {
		return state.downScale
	},

	getAudioCurrent(state) {
		return state.audioCurrent
	},
	
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

	setAudioTimecode(state, payload){
		// console.log("setAudioTimeCode at ", payload, state.audioCurrent)
		state.audioCurrent.currentTime = payload
	},

	setEndedAudios(state, payload){
		state.endedAudios = payload
	},

	setChoiceIsDisplayed(state, payload){
		state.choiceIsDisplayed = payload
	},

	setChoiceHaveBeenMade(state, payload){
		state.choiceHaveBeenMade = payload
	},

	incrementChoiceChangedCounter(state){
		state.choiceChangedCounter++
	},

	setCurrentSequenceInfos(state, payload){
		state.currentSequenceInfos = payload
	},

	setFinishBegan(state, payload){
		state.finishBegan = payload
	},

	setMobileBlurCurtainIsDisplayed(state, payload){
		state.mobileBlurCurtainIsDisplayed = payload
	}
}

