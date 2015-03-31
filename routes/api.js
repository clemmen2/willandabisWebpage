var express = require('express');
var router = express.Router();
var fs = require('fs');
var parse = require('csv-parse');
var path = require('path');
var ExifImage = require('exif').ExifImage;
var images=[];

/* GET home page. */
router.get('/guest', function(req, res, next) {	
	if(req.session.auth){
		  rs = fs.createReadStream(path.resolve(__dirname+'/../data/weddingContacts.csv'));
		  parser = parse({columns: true}, function(err,data){
		  	res.send(data);
		  })
		  rs.pipe(parser);
	}else{
		res.sendStatus(401);
	};
});
router.post('/login', function(req, res, next){
	var sess = req.session
	if(req.body.psk == 'willabigail2016'){
		sess.auth = true;
		sess.auth.maxAge = 1800000;
		res.sendStatus(200);
	}else{
		res.sendStatus(401);
	}
});
router.get('/photos', function(req,res,next) {
		fs.readdir(path.resolve(__dirname+'/../public/img/'),function(err,files){
			images = files.filter(function(image){
				splitImage = image.split('_');
				if(splitImage[splitImage.length-1] == 'original')
					return false;
				else
					return true;
			}).map(function(link,index,origArray){
				var newImage = {_id:index,url:link};
				return newImage;
			});
			res.send(images);
		});
});
router.get('/photo/:id', function(req,res,next){
	new ExifImage({image:path.resolve(__dirname+'/../public/img/'+images[req.params.id].url)},function(err,exifData){
		if (err)
			console.log(err);
		else{
			if(exifData.exif.UserComment){
				res.send({comment: exifData.exif.UserComment.toString().slice(5)});
			}else{
				res.send({comment: 'No Caption was Found'});
			}
		}
	})
});
module.exports = router;
