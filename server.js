//Dependencies
//Step 2: Create Auth Endpoints - Install and require your dependencies

var express = require('express');
var session = require('express-session');
var passport = require('passport');
var githubStrategy = require('passport-github').Strategy;
var bodyParser = require('body-parser');
var GitHubApi = require("github");

//port
var port = 8090;

//app definition
var app = express();

//The GitHubApi class is imported from the node-github module. This class provides access to all of GitHub's APIs (e.g. user, issues or repo APIs). The getFollowingFromUser method lists all followers of a given GitHub user. Is is part of the user API. It takes the user name as first argument and a callback as last argument. Once the follower list is returned from the server, the callback is called.
var github = new GitHubApi({
    version: "3.0.0"
 })

///define Github Strategy - Create a Github app and then set up the Github Strategy in your server.js with your associated clientID and clientSecret. Use a callbackURL that will redirect the user to /auth/github/callback

passport.use(new githubStrategy({
	clientID: "<INSERT CLIENT ID>",
	clientSecret: "<INSERT CLIENT SECRET>",
	callbackURL: "http://localhost:8090/auth/github/callback"
	}, function(token, tokenSecret, profile, done) {
		return done (null, profile);	
//The verify callback for OAuth-based strategies accepts token, tokenSecret, and profile arguments. token is the access token and tokenSecret is its corresponding secret. profile will contain user profile information provided by the service provider

}));

//authentication variable //this is simply utilizing a function from the passport request.js file
var isAuthed = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(403).end();
	}
	return next();
}

//session middleware
app.use(session({
	secret:'todayisanaa;dfjal;kfjadl'
}));

//static public folder middleware //In Node.js, __dirname is always the directory in which the currently executing script resides
app.use(express.static(__dirname+'/public'));

//passport initialization
app.use(passport.initialize());
app.use(passport.session());

//passport serialization ///This method can access the user object we passed back to the middleware. It's job is to determine what data from the user object should be stored in the session.
passport.serializeUser(function(user, done) {
	done(null, user)
});
passport.deserializeUser(function(obj, done){
	done(null, obj)
})

//Step 2 - Auth Endpoints - Github Authorization route

app.get('/auth/github', passport.authenticate('github'));
//Authenticating requests is as simple as calling passport.authenticate() and specifying which strategy to employ.
app.get('/auth/github/callback', passport.authenticate('github', {
	successRedirect: '/#/home',
	failureRedirect: '/'
	}))

// get profile

///Let's link the Angular Github service to our server.js GET /api/github/following

//In server.js, create the above endpoint and have it return the users that currently logged in user follows. You can either use an http request using the request module, or you can use the npm module node-github

app.get('/api/github/following', isAuthed, function(req, res) {
	github.user.getFollowingFromUser({
    user: req.user.username
	}, function(err, response) {
	    console.log(JSON.stringify(response));
	    res.send(JSON.stringify(response));
	})
});

//Step 5: Friend Route - Create a method in your Github service called getFriendActivity and make sure it's passed a username
app.get('/api/github/:username/activity', isAuthed, function(req, res) {
	// console.log(github)
	github.events.getFromUser({
		user: req.params.username
	}, function(err, response) {
		res.json(response)
	})

})

app.listen(port);