const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
    fs.unlink(path.join(__dirname, `../${filePath}`), (err) => {
        if (err) throw (err);
    })
}

exports.deleteFile = deleteFile;