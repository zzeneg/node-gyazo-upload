const fs = require('fs');
const crypto = require('crypto');

function saveFileAsync (name, file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file.path, (err, data) => {
            if (err) {
                reject(err.message);
            }

            var dstName;
            if (name === 'imagedata') {
                var hash = crypto.createHash('md5').update(data, 'binary').digest('hex');
                dstName = process.env.IMAGE_FOLDER + '/' + hash + '.png';
            } else {
                dstName = process.env.FILE_FOLDER + file.name;
            }

            fs.rename(file.path, process.env.WEB_SERVER_FOLDER + dstName, err => {
                if (err) {
                    reject(err.message);
                }

                resolve(process.env.HOST + dstName);
            });
        });
    });
}

module.exports = saveFileAsync;