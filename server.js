var express = require('express'),
	server = express(),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	multer = require('multer'), // for handling multipart uploading in the form.
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
			// the new dotJade file is created and stored in a temporary folder
			fs.writeFile(path, jade, function(err){
				res.download(path, function(err){
					//dowloading completed
					console.log("Download Completed");
					// After each conversion and completed download, the temporaries files are deleted
					// so there's no file stored on our hard drive.
					try {var files = fs.readdirSync('./tmp/');
					} catch(e) {return;}
					if(files.length>0) 
						for (var i = 0; i < files.length; i++) {
         					var filePath = './tmp/' + files[i];
          					if (fs.statSync(filePath).isFile()){
            					fs.unlinkSync(filePath);
            					console.log("File "+filePath+" deleted");
            				}
            			}
				});
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