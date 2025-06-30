const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
const { NodeSSH } = require('node-ssh')

const ssh = new NodeSSH()

class LocalDistDeployPlugin {
  constructor(options = {}) {
    this.options = options
    this.configPath = path.resolve(process.cwd(), 'deploy.json')
  }

  async apply() {
    try {
      // 1. 读取并校验 deploy.json
      if (!fs.existsSync(this.configPath)) {
        const defaultConfig = {
          host: '',
          username: '',
          password: '',
          targetDir: '',
          ignore: [],
          backupDir: 'backup'
        }
        fs.writeFileSync(this.configPath, JSON.stringify(defaultConfig, null, 2))
        console.warn('未找到 deploy.json，已生成默认配置文件，请填写必要字段后重新执行打包')
        return
      }
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'))
      const requiredFields = ['host', 'username', 'password', 'targetDir']
      for (const field of requiredFields) {
        if (!config[field]) throw new Error(`缺少配置字段: ${field}`)
      }
      config.backupDir = config.backupDir || 'backup'
      config.ignore = config.ignore || []

      // 2. SSH连接
      await ssh.connect({
        host: config.host,
        username: config.username,
        password: config.password
      })
      console.log('SSH连接成功')

      const targetDir = config.targetDir
      const backupDir = path.posix.join(targetDir, config.backupDir)

      // 3. 检查部署目录是否存在
      const result = await ssh.execCommand(`[ -d "${targetDir}" ] && echo "exists" || echo "not exists"`)
      if (result.stdout.trim() !== 'exists') {
        await ssh.execCommand(`mkdir -p ${targetDir}`)
        console.log(`创建目录：${targetDir}`)
      }

      // 检查备份目录是否存在
      const backupCheck = await ssh.execCommand(`[ -d "${backupDir}" ] && echo "exists" || echo "not exists"`)
      if (backupCheck.stdout.trim() !== 'exists') {
        await ssh.execCommand(`mkdir -p ${backupDir}`)
        console.log(`创建备份目录：${backupDir}`)
      }

      // 4. 打包dist为zip，命名为年月日时分
      const distPath = path.resolve(process.cwd(), 'dist')
      const zipName = this.getZipName()
      const zipPath = path.resolve(distPath, zipName)
      await this.zipDirectory(distPath, zipPath)
      console.log(`打包zip完成：${zipName}`)

      // 上传zip到 backup 目录
      await ssh.putFile(zipPath, `${backupDir}/${zipName}`)
      console.log('上传zip完成')

      // 5. 清空部署目录（保留 ignore 文件和 backup 目录）
      const ignoreList = config.ignore
        .concat([config.backupDir])
        .map((file) => `! -name "${file}"`)
        .join(' ')
      const cleanCommand = `find ${targetDir} -mindepth 1 -maxdepth 1 ${ignoreList ? ignoreList : ''} -exec rm -rf {} +`
      await ssh.execCommand(cleanCommand)
      console.log('清空部署目录完成')

      // 解压zip
      await ssh.execCommand(`unzip -o ${backupDir}/${zipName} -d ${targetDir}`)
      console.log('解压完成')

      ssh.dispose()
    } catch (error) {
      console.error('部署插件出错：', error)
      ssh.dispose()
    }
  }

  getZipName() {
    const now = new Date()
    const pad = (n) => (n < 10 ? '0' + n : n)
    const ymdhm = [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate()),
      pad(now.getHours()),
      pad(now.getMinutes())
    ].join('')
    return `${ymdhm}.zip`
  }

  zipDirectory(sourceDir, outPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outPath)
      const archive = archiver('zip', { zlib: { level: 9 } })

      output.on('close', () => resolve())
      archive.on('error', (err) => reject(err))

      archive.pipe(output)
      archive.glob('**/*', {
        cwd: sourceDir,
        ignore: [path.basename(outPath)]
      })
      archive.finalize()
    })
  }
}

module.exports = LocalDistDeployPlugin
