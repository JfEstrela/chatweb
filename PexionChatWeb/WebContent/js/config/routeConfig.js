angular.module("directive.g+signin").config(function($routeProvider) {
	$routeProvider.when("/chat", {
		templateUrl : "chat.html"
	});
	$routeProvider.when("/login", {
		templateUrl : "login.html"

	});
	
	$routeProvider.otherwise({
		redirectTo : "/login"
	});

});	