var app = angular.module('coderFriends');



//In GithubService, create a getFollowing method that returns the results from the API call we created in Step 3.

app.service('githubService', function($http, $q) {
	this.getFollowing = function() {
		return $http({
			method: 'GET',
			url: '/api/github/following'
		})
		.then(function(res) {
			return res.data;
		})
	}
	this.getEvents = function(username) {
		console.log(username)
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/github/' + username + '/activity'
		}).then(function(res){
			console.log(res.data);
			deferred.resolve(res.data)
		}, function(err){
			deferred.reject(err);
		})
		return deferred.promise;
	}
	
})