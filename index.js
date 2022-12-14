const schedule = require('node-schedule');
const ddns = require('./lib/ddns')
const { getIP } = require('./lib/util');
const DingRobot = require('./lib/dingding')
const robot = new DingRobot()

// 执行的任务
let lastIP = ''
const jobFun = async () => {
    ip = await getIP().catch(e => {
        return Promise.reject(`get publicip failed \n${e.toString()}`)
    })

    if (lastIP === ip) return ip

    await ddns(ip)
        .catch(e => {
            return Promise.reject(`ddns failed: ${ip}\n ${e.toString()}`)
        })
    
    return ip
}

// 开始执行任务
const sleepTime = 5000
const job = schedule.scheduleJob(new Date().getTime() + sleepTime, jobFun)
job.on('success', ip => {
    if (lastIP === ip) {
        console.log('ip not change')
        return
    }
    lastIP = ip
    robot.sendText(`ddns success: ${ip}`)
})
job.on('error', msg => {
    robot.sendText(`ddns failed: ${msg}`)
})
setTimeout(() => {
    job.reschedule('*/10 * * * *')
}, sleepTime)
robot.sendText('ddns start')

/** 异常退出监控 */
const onExit = signal => {
    return async () => {
        await robot.sendText(`receive signal ${signal}, ddns stop`)
        await schedule.gracefulShutdown()
        process.exit(0)
    }
}
const signals = ['SIGINT', 'SIGTERM']
signals.forEach(key => {
    process.on(key, onExit(key))
})
