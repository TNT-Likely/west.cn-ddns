
const https = require("https")
const config = require("../config")
const { getCookie } = require("./cookie")
const { getIP } = require("./util")
const {  domainId, recitem = 'nas', rectype = 'A' } = config

/** 请求cookie */
let cookie = ''

/**
 * 请求西部数码接口
 * @param {*} url 请求地址
 * @param {*} postData 请求数据
 */
const requestWestCN = (url, postData) => {
    return new Promise((resolve, reject) => {
        const server = https.request({
            hostname: 'www.west.cn',
            port: 443,
            path: `${url}?_r_=${Math.random().toString().slice(0, 20)}`,
            method: 'POST',
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6",
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                cookie,
                "Referer": `https://www.west.cn/Manager/domainnew/rsall.asp?domainid=${domainId}`,
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
        }, res => {
            let chunkData = ''
            res.on('data', (d) => {
                chunkData += d
            })

            res.on('end', () => {
                let result = {}
                try {
                    result = JSON.parse(chunkData)
                } catch { }
                if (result.result === '200') {
                    resolve(result)
                } else {
                    reject(chunkData)
                }
            })
        })

        server.write(postData)
        server.end()
    })
}

const ddns = async (recval) => {
    cookie = await getCookie()
    const response = await requestWestCN('/Manager/domain/load.asp', `did=${domainId}&act=rsalldomainlist&keyword=`)
    const domainList = response?.datalist?.datas || []

    const exist = domainList.find(v => v.itm === recitem)

    // 已存在该域名解析
    if (!!exist) {
        // 域名解析类型和地址均相同
        if (exist.type === rectype && exist.val === recval) {
            //被暂停开启
            if (exist.ispause === '1') {
                return requestWestCN(`/Manager/domain/load.asp`, `act=rsalldounpause&did=${domainId}&cid=${exist.id}`)
                    .catch(() => {
                        return Promise.reject('已存在该解析,域名解析开启失败')
                    })
            } else {
                return Promise.resolve()
            }
        }
        // 修改解析
        else {
            return requestWestCN(`/Manager/domain/load.asp`, `act=rsalldomod&did=${domainId}&cid=${exist.id}&val=${recval}&rectype=${rectype}&ttl=900&mxlevel=10`)
        }
    }

    return requestWestCN('/Manager/domain/load.asp', `act=rsalladdrec&recitem=${recitem}&rectype=${rectype}&recline=&val=${recval}&recttl=900&mxlevel=10&did=${domainId}`)
}

module.exports = ddns

