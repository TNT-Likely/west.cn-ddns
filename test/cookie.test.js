const { getCookie } = require('../lib/cookie')

getCookie()
    .then(data => {
        console.log('cookie is: ', data)
    })
    .catch(err => {
        console.log('get cookie failed cause by : ', err.toString())
    })