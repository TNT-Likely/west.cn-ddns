# west.cn-ddns

西部数码域名ddns解析【docker/widows/mac/linux】

## 如何使用

### docker
```bash
docker run -i \
    -e "domainId=你的域名id" \
    -e "recitem=你的域名前缀【默认nas]" \
    -e "dingAccessToken=钉钉群机器人令牌【不填则不通知】 " \
    -e "dingSecret=钉钉群机器人签名【不填则不通知】 " \
    -e "name=你的用户名" \
    -e "password=你的密码" \
    sunxiao0721/west.cn-ddns
```

### macos/windows/linux

#### 下载代码
```bash
git clone git@github.com:TNT-Likely/west.cn-ddns.git
```
#### 编辑配置
config 目录下拷贝config.js，命名为config.tmp.js,修改其中的配置

#### 安装&运行
```bash
npm i
npm start
```
