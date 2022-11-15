const https = require('https')
const CryptoJS = require('crypto-js')
const config = require('../config')
const { dingAccessToken, dingSecret } = config

class DingDing {
    constructor() {
        this.accessToken = dingAccessToken
        this.secret = dingSecret
    }

    getSign(timestamp) {
        const sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(`${timestamp}\n${this.secret}`, this.secret))
        return sign
    }

    send(obj) {
        if (!this.accessToken || !this.secret) {
            return
        }

        const postData = JSON.stringify(obj)
        let chunkData = ''
        return new Promise((resolve, reject) => {
            const timestamp = Date.now()
            const sign = this.getSign(timestamp)
            const req = https.request({
                hostname: 'oapi.dingtalk.com',
                port: 443,
                path: `/robot/send?access_token=${this.accessToken}&timestamp=${timestamp}&sign=${sign}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, res => {
                res.on('data', (d) => {
                    chunkData += d
                })

                res.on('end', () => {
                    try {
                        chunkData = JSON.parse(chunkData)
                    } catch (e) { }
                    if (chunkData.errcode === 0) {
                        resolve(chunkData)
                    } else {
                        console.error('dingding robot send message failed!', chunkData)
                        // reject(chunkData)
                        resolve()
                    }
                })
            })
            req.write(postData)
            req.end()
        })
    }

    /** 发送纯文本消息 */
    sendText(content) {
        console.log(content)
        return this.send({
            msgtype: 'text',
            text: {
                content
            }
        })
    }
}


module.exports = DingDing