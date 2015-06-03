var express = require('express'),
	server = express(),
	//pub = __dirname + '/static/',
	//views = __dirname + '/views',
	bodyParser = require('body-parser'),
	fs = require('fs'),
	multer = require('multer'),
	done = false,
	filename = "",
	html2jade;
try {
	html2jade = require('html2jade');
} catch (err) {
	console.log('Failure to load \'html2jade\' module');
	html2jade = require('./node_modules/html2jade/lib/html2jade')
}

server.use(bodyParser.urlencoded({ extended: true }));
//server.use(express.static(pub));
server.set('view engine', 'jade');
server.use(express.static(__dirname+'/views/public'));

/*Configure the multer.*/

server.use(multer({ dest: './tmp/'}));

//converting ...
server.post('/convert',  function (req, res) {
	console.log(req.files.userFile.name)
	path = './tmp/'+req.files.userFile.name;
	fs.readFile(path, function(err, content){	
		html2jade.convertHtml(content, {}, function (err, jade) {
			console.log("creating the new file");
			path = './tmp/'+req.files.userFile.originalname.substring(0,req.files.userFile.originalname.lastIndexOf("."))+'.jade';
			console.log(path);
			fs.writeFile(path, jade, function(err){
				res.download(path);
				if(err) console.log(err)
				console.log("File created");
			});
		});
	});
	//res.end();
});


server.get('/', function (req, res) {
	res.render('index');
});
server.listen(5000);