const { exec } = require('child_process');

const getIP = () => {
    return new Promise((resolve, reject) => {
        exec('curl ip-adresim.app', function (error, stdout, stderr) {
            if (error) {
                reject(error)
            } else {
                resolve(stdout)
            }
        })
    })
}


module.exports = {
    getIP
}