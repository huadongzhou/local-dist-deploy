# webpack-dist-deploy

> [!NOTE]
> This is the repository for Vue 2
> Next support Vue 3 ......

<h2 align="center">This plugin supports automatic packaging and uploading for server deployment</h2>
  
<br/>

## Quickstart

- Add it to an existing webpack.config.js:

  ```bash

  import WebpackDistDeployPlugin  from 'webpack-plugin-dist-deploy'
  //
  //
  //
  plugins:[
    //
      new WebpackDistDeployPlugin()
    //
  ]
  ```

## Lib Params

<table>
    <tr>
      <th><span style="width:150px;display:inline-block;">属性</span></th>
      <th>类型</th>
      <th><span style="width:50px;display:inline-block;">默认值</span></th>
      <th>描述</th>
    </tr> 
     <tr>
      <th><span style="width:150px;display:inline-block;">host</span></th>
      <th>String</th>
      <th><span style="width:50px;display:inline-block;">无</span></th>
      <th>服务器IP</th>
    </tr> 
    <tr>
      <th><span style="width:150px;display:inline-block;">username</span></th>
      <th>String</th>
      <th><span style="width:50px;display:inline-block;">无</span></th>
      <th>服务器账户</th>
    </tr> 
    <tr>
      <th><span style="width:150px;display:inline-block;">password</span></th>
      <th>String</th>
      <th><span style="width:50px;display:inline-block;">无</span></th>
      <th>服务器密码</th>
    </tr> 
    <tr>
      <th><span style="width:150px;display:inline-block;">targetDir</span></th>
      <th>String</th>
      <th><span style="width:50px;display:inline-block;">无</span></th>
      <th>部署目录</th>
    </tr> 
    <tr>
      <th><span style="width:150px;display:inline-block;">ignore</span></th>
      <th>Array</th>
      <th><span style="width:50px;display:inline-block;">[backup]</span></th>
      <th>忽略文件</th>
    </tr> 
    <tr>
      <th><span style="width:150px;display:inline-block;">backupDir</span></th>
      <th>String</th>
      <th><span style="width:50px;display:inline-block;">backup</span></th>
      <th>备份文件夹名</th>
    </tr> 
  </table>

## 喝杯咖啡

如果能帮到你 我很高兴！！！ 来杯咖啡刺激开发进度

<img
    src="https://raw.githubusercontent.com/huadongzhou/view-printer/master/coffee.jpg"
      width="400px"
    />
