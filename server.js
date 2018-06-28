const http = require('http');
const formidable = require('formidable');
const dotenv = require('dotenv');

const saveFileAsync = require('./gyazo');

dotenv.load();

http.createServer((req, res) => {
        try {
            if (req.url === process.env.URL && req.method.toUpperCase() === 'POST') {
                if (req.headers['auth-token'] === process.env.TOKEN) {
                    var form = new formidable.IncomingForm();
                    form.encoding = 'binary';
                    form.on('file', (name, file) => {
                        saveFileAsync(name, file)
                            .then(url => res.write(url))
                            .catch(err => {
                                res.writeHead(500);
                                res.end(err);
                            })
                    });
                    form.parse(req);
                } else {
                    res.writeHead(401);
                    res.end('Authorization required');
                }
            }
        } catch (e) {
            res.writeHead(500);
            res.end(e.toString());
        }
    })
    .listen(process.env.PORT);
