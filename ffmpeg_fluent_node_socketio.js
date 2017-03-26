

/*/
使用 JavaScript 把 ArrayBuffer 做 base64 編碼
https://kheresy.wordpress.com/2013/09/02/some-method-to-encode-arraybuffer-as-base64/

On Mobile, Data URIs are 6x Slower than Source Linking
http://www.mobify.com/blog/data-uris-are-slow-on-mobile/

JavaScript - Creating an Image from binary JPG data
http://stackoverflow.com/questions/23309956/javascript-creating-an-image-from-binary-jpg-data
//*/

process.env.FFMPEG_PATH = "E:\\4.Tools\\ffmpeg\\bin\\ffmpeg.exe";

var http = require('http');
var socket_io = require('socket.io');
var node_static = require('node-static');
var childProcess = require('child_process');
var crypto = require('crypto');
var ffmpeg = require('fluent-ffmpeg');

var conns = [];
var frame = "";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// static files server
var static_directory = new node_static.Server(__dirname + "/static");

// http server
var http_server = http.createServer();
http_server.addListener('request', function(req, res) {
    static_directory.serve(req, res);
});
/*/
http_server.addListener('upgrade', function(req, res) {
    res.end();
});
//*/


// socket.io server
var io_server = socket_io(http_server);
io_server
	.of('/echo')
	.on('connection', function(conn) {
		conns.push(conn);
		console.log('conns.length: ' + conns.length);
		
		conn.on('msg', function(data) {
			console.log('msg ' + JSON.stringify(data));
			conns.forEach(function(conn) {
				conn.emit('msg', { body: data.body });
			});
		});
		
		conn.on('ack', function(data) {
			conn.timestamp = data.timestamp;
		});
		
		conn.on('close', function() {
			console.log('close ' + conn);
			conns.splice(conns.indexOf(conn), 1);
			console.log('conns.length: ' + conns.length);
		});
	});


// sockjs_echo.installHandlers(http_server, { prefix: '/echo' });
http_server.listen(9999, '0.0.0.0');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// fluent ffmpeg
var command = ffmpeg()
	.input("video=Virtual Webcam 8.0")
	.inputFormat('dshow')
	.inputOptions('-video_size 720x480')
	.fps(60)
	.format('mjpeg')
	.outputOptions('-q:v 12')
	.size('720x480')
	.on('error', function(err) {
		console.log('ffmpeg.error: ' + err.message);
	})
	.on('end', function() {
		console.log('ffmpeg.end !');
	});
	
var ffstream = command.pipe();

ffstream.on('data', function(data) {
	frame = new Buffer(data);
	var hash = crypto.createHash('md5').update(data).digest("hex");
	console.log('ffmpeg.data:', data.length, hash);
});

setInterval(function() {
	var now = new Date().getTime();
	conns.forEach(function(conn) {
		var timestamp = conn.timestamp ? conn.timestamp : 0;
		if (now - timestamp > 200) {
			conn.emit('stream', { body: null, timestamp: now });
		} else {
			conn.emit('stream', { body: frame, timestamp: now });
		}
	});
}, 1000 / 15);


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


