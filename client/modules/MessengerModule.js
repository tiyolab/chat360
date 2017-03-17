const MessengerModule = angular.module('MessengerModule', []);

MessengerModule.service('messengerService', function(){
	var that = this;
	
	this.getTextResponseTemplate = function(){
		return {
			type: 'Text',
			payload: ''
		}
	}
	
});