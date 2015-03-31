angular.module('ourApp', ['ngRoute','timer','akoenig.deckgrid'])
.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl: 'main.html'
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
	.when('/photo/:photoId',{
		templateUrl: 'image.html'
	})
	.otherwise({
		templateUrl: 'error.html'
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
.service('photos', ['$http',function($http){
	photoFunc={};
	images=[];
	photoFunc.getPhotos = function(callback){
		if(images.length === 0){
			$http.get('/api/photos').
			success(function(data, status, headers, config){
				images=data;
				callback(data);
			});
		}else{
			callback(images);
		};
	};
	photoFunc.getPhotoCom = function(id,callback){
		photoFunc.getPhotos(function(intImages){
			foundImage = intImages.filter(function(image){
				if(image._id == id)
					return true;
				else
					return false;
			})[0];
			$http.get('/api/photo/'+id).
			success(function(data,status,headers,config){
				callback(data);
			})
		})
	}
	return photoFunc;
}])
.controller('mainCtrl', ['photos', function(photos){
	var that = this;
	photos.getPhotos(function(images){
		that.photos=images;
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
.controller('photoCtrl',['$routeParams','photos','$location',function($routeParams,photos,$location){
	var that = this;
	photos.getPhotos(function(images){
		that.photo = images.filter(function(image){
			if (image._id == $routeParams.photoId){
				return true;
			}
		})[0];
		if (!that.photo){
			$location.path('/error')
		}
	})
	photos.getPhotoCom($routeParams.photoId,function(imageCaption){
		that.photo.comment = imageCaption.comment;
	});
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