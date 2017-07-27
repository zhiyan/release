# release 命令

### 项目package.json中配置
```javascript
	script: {
		"release": {
			"path": "./dist",
			"target": "../release",
			"command": "echo 'pre release'",
			"valid": ""
		}
	},

	// 若不设置release字段，为以下的默认设置
	"release": {
    "path": "./dist",
    "target": "../release",
    "command": "",
    "valid": "/(\.js|\.css|\.png|\.jpg|\.gif|\.jpeg|\.svg)$/"
  },
```

### 参数
* path: 压缩的源文件夹
* target: 生成压缩包的目标文件夹
* command: 压缩前要执行的命令
* valid: 压缩的合法文件

### 使用
```
	npm run release
```

