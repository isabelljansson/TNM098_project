//Main controller
var myApp = angular.module('myApp', []);

myApp.controller('mainCtrl', function($scope, $http) {
	console.log('hello from mainCtrl');

	//test to call server to find an item in db
	/*$http.get('/find')
        .success(function(data) {
            console.log('response from server:' + data);
        })
        .error(function(data) {
            console.log('error');
        });*/

});
/*
myApp.factory('d3Service', [function(){
	var d3;
	// insert d3 code here
	return d3;
}];*/