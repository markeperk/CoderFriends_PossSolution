var app = angular.module('coderFriends');

app.controller('friendCtrl', function($scope, events) {
	console.log(events)
	$scope.events = events	
})