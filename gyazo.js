const fs = require('fs');
const crypto = require('crypto');

saveFileAsync = (name, file) => {
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

            move(file.path, dstName, err => {
                if (err) {
                    reject(err.message);
                }

                resolve(process.env.HOST + dstName);
            });
        });
    });
}

move = (oldPath, newPath, callback) => {

    fs.rename(oldPath, newPath, err => {
        if (err && err.code === 'EXDEV') {
            copy();
            callback();
        } else {
            callback(err);
        }
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        writeStream.on('error', callback);
        readStream.on('error', callback);
        readStream.on('close', () => {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
}

module.exports = saveFileAsync;