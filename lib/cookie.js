const puppeteer = require("puppeteer")
const config = require('../config')
const { name, password } = config

const getCookie = async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    await page.goto('https://www.west.cn/login.asp');

    await page.waitForSelector('#J_loginPage_u_name')

    await page.type('#J_loginPage_u_name', name)
    await page.type('#J_loginPage_u_password', password)

    const submitSelector = 'button.g-common-btn.g-blue-btn';
    await page.waitForSelector(submitSelector);
    const [response] = await Promise.all([
        page.waitForNavigation(), // The promise resolves after navigation has finished
        page.click(submitSelector), // Clicking the link will indirectly cause a navigation
    ]);

    const cookies = await page.cookies()

    return cookies.reduce((a, c) => {
        return a += `${c.name}=${c.value};`
    }, '')
}

module.exports = {
    getCookie
}