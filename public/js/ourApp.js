angular.module('ourApp', ['ngRoute','timer','akoenig.deckgrid'])
.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl: 'main.html'
	})
	.when('/about',{
		templateUrl: 'about.html'
	})
	.when('/event',{
		templateUrl: 'event.html'
	})
	.when('/guest',{
		templateUrl: 'guests.html'
	})
	.when('/guest/:guestId',{
		templateUrl: 'guest.html'
	})
	.when('/login',{
		templateUrl: 'login.html'
	})
}])
.run(['$rootScope', function($rootScope){
	$rootScope.title='Will and Abi';
}])
.service('guests', ['$http','$location', function($http,$location){
	var guests = [];
	var fun = {};
	fun.getGuests = function(callback) {
		if (guests.length === 0){
			$http.get('/api/guest').
			success(function(data, status, headers, config){
				guests = data;
				callback(guests);
			}).
			error(function(data, status, headers, config){
				if(status == 401){
					$location.path('/login');
				}
			})
		}else{
			callback(guests);
		}
	};
	fun.getGuest = function(id,callback) {
		fun.getGuests(function(data){
			callback(data.filter(function(guest){
				if(guest._id == id)
					return true;
				else
					return false;
			})[0])
		})
	};
	fun.getFamily = function(id,callback) {
		fun.getGuests(function(data){
			callback(data.filter(function(guest){
				if(guest.familyId == id)
					return true;
				else
					return false;
			}))
		})
	};
	return fun;
}])
.controller('mainPage', ['$http','$scope',function($http,$scope){
	var that = this;
	$http.get('/api/photos').
		success(function(data, status, headers, config){
			that.photos = data;
		});
}])
.controller('guestsCtrl', ['$location','guests', function($location,guests){
	var that = this;
	that.predict = 'lastName';
	guests.getGuests(function(data){
		that.guests = data;
	});
	that.click = function(id){
		$location.path('/guest/'+id)
	};
}])
.controller('guestCtrl',['$location', '$routeParams', 'guests', function($location,$routeParams,guests){
	var that = this;
	var re = /(\d{3})(\d{3})(\d{4})/;
	guests.getGuest($routeParams.guestId,function(guest){
		guest.phone = guest.phone.replace(re, '($1)$2-$3')
		that.guest = guest;
		guests.getFamily(that.guest.familyId,function(family){
			that.family = family.filter(function(member){
				if(that.guest._id == member._id)
					return false;
				else
					return true;
			}).map(function(member){
				return {'_id':member._id,'lastName':member.lastName,'firstName':member.firstName};
			});
		})
	});
	that.back = function(){
		$location.path('/guest');
	}
}])
.controller('loginCtrl',['$http','$location', function($http,$location){
	var that=this;
	that.pass = null;
	that.rem = false;
	that.err = [];
	that.submit = function(){
		if (that.pass !== null){
			$http.post('/api/login',{
				psk: that.pass,
				rem: that.rem
			}).success(function(data,status,headers,config){
				if(status==200)
					$location.path('/guest');
			}).error(function(data,status,headers,config){
				if(status==401)
					that.err = ["Incorrect Passkey"];
			})
		}
	}
	
}])