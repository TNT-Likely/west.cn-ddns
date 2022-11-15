const fs = require('fs')
const path = require('path')

const tmpPath = path.resolve(__dirname, './config.tmp.js')
const configPath = path.resolve(__dirname, './config.js')

if (process.env.domainId) {
    const { domainId, cookie, recitem, rectype, dingAccessToken, dingSecret } = process.env
    module.exports = {
        domainId,
        cookie,
        recitem,
        rectype,
        dingAccessToken,
        dingSecret
    }
} else if (fs.existsSync(tmpPath)) {
    module.exports = require(tmpPath)
} else if (fs.existsSync(configPath)) {
    module.exports = require(configPath)
} else {
    throw new Error('缺少配置文件')
}