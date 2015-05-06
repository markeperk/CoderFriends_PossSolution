var app = angular.module('coderFriends');

app.controller('homeCtrl', function($scope, friends) {

//In your HomeCtrl, let's throw friends into the scope and render them in the view.
	$scope.friends = friends;

	
})