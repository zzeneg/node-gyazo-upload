var http = require("http");
var fs = require("fs");
var crypto = require("crypto");
var formidable = formidable = require("formidable");
var config = require('./config');

http.createServer(function(req, res) {
        if (req.url === config.path) {
            var form = new formidable.IncomingForm();
            form.encoding = "binary";
            form.on("file", function(name, file) {
                fs.readFile(file.path, function(err, data) {
                    if (err)
                        console.log(err);
                    var dstName;
                    if (name === "imagedata") {
                        var md5sum = crypto.createHash("md5");
                        md5sum.update(data, "binary");
                        var hash = md5sum.digest("hex");
                        dstName = config.imageFolder + hash + ".png";
                    } else {
                        dstName = config.fileFolder + file.name;
                    }
                    fs.rename(file.path, config.webServerFolder + dstName, function(err) {
                        if (err) {
						console.log(err);
                            res.writeHead(500);
                            res.end(err.message);
                        } else {
                            res.end("http://" + config.host + dstName);
                        }
                    });
                });
            });
            form.parse(req);
        }
    })
    .listen(config.port);
