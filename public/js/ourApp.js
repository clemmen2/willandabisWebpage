angular.module('ourApp', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl: 'main.html'
	})
	.when('/will',{
		templateUrl: 'will.html'
	})
	.when('/abi',{
		templateUrl: 'abi.html'
	})
}])
.run(['$rootScope', function($rootScope){
	$rootScope.title='Will and Abi';
}])