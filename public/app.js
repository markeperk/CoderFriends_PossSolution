var app = angular.module('coderFriends', ['ngRoute']);

app.config(function($routeProvider, $httpProvider) {

//Step 5 - NG unauthed auto-redirect - We need a way for Angular to detect an un-authed web request (403) so we can redirect them back to the login page. We can do that by injecting a service that acts as an interceptor in Angular's httpProvider. It works sort of like middleware in Node.
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $httpProvider.interceptors.push('myHttpInterceptor');

//Step 1 - create Skeleton of angular app with routing
	$routeProvider
	.when('/', {
		templateUrl: '/templates/login.html'
	})
	.when('/home', {
		templateUrl: '/templates/home.html',
		controller: 'homeCtrl',
		//Step 4 - Home Ctrl - Github Service - Let's resolve the promise from getFollowing into a friends variable in the /home route.
		resolve: {
			friends: function(githubService) {
				return githubService.getFollowing();
			}
		}
	})
	.when('/friend/:github_username', {
	templateUrl: '/templates/friend.html',
	controller: 'friendCtrl',
	//Step 5 - Friend Route - Have eventData be a resolved variable in the app's routing, then render each of the events in the /friend/:github_username route in the Angular app.
	resolve: {
		events: function(githubService, $route) {
			return githubService.getEvents($route.current.params.github_username)
		}
	}


	
})
	.otherwise('/')
});

//Step 5 - NG unauthed auto-redirect

// register the interceptor as a service
app.factory('myHttpInterceptor', function($q) {
    return {
        // optional method
        'responseError': function(rejection) {
            if (rejection.status == 403) {
                document.location = '/';
                return;
            }
            return $q.reject(rejection);
        }
    };
});