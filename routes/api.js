var express = require('express');
var router = express.Router();
var fs = require('fs');
var parse = require('csv-parse');
var path = require('path');

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
		res.send(files.map(function(link){
			return {url:link};
		}));
;	});
});
module.exports = router;
