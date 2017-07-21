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

### 使用
```
	npm run release
```

