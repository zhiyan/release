#!/usr/bin/env node
const CURR = process.cwd()
const path = require('path')
const git = require('simple-git')(CURR)
const exec = require('child_process').exec
const fs = require('fs-extra')
const JSZip = require("jszip")
const logger = require('log4js').getLogger('release')
const pkg = require(path.resolve(process.cwd(), 'package.json'))
const klaw = require('klaw')

// 合法文件
const rValid = /(\.js|\.css|\.png|\.jpg|\.gif|\.jpeg|\.svg)$/

// 输出文件后缀
const POSTFIX = '.zip'

// 压缩目录
const distDir = path.join(CURR, pkg.release && pkg.release.path || './dist')

// 输出目录
const releaseDir = path.join(CURR, pkg.release && pkg.release.target || '../release')

// 执行命令
const runCommand = pkg.release && pkg.release.command || ''

fs.emptyDirSync(distDir)

git.status(function(err,res){
	if(!err){
		logger.trace('[分支] ' + res.current)
		if(pkg.runCommand){
			logger.trace('正在执行前置脚本...')
			const command = exec(`${runCommand}`, {maxBuffer:5000 * 1024}, buildZip.bind(this, branch))
			command.stderr.on('data', data => console.log(data))
		}else{
			buildZip(res.current)
		}
	}
})

/**
 * 创建压缩文档
 */
function buildZip(branch){
	logger.trace('开始创建压缩文档...')
	const zip = new JSZip()
	klaw(distDir)
		.on('data', function(item){
			if(rValid.test(item.path)){
				var fileContent = fs.readFileSync(item.path)
				zip.file(formatZipFilePath(item.path), fileContent)
			}
		})
		.on('end', function(){
			generate(zip, branch)
		})
}

/**
 * 格式化分支
 */
function formatBranch(branch){
	return branch.replace('/', '-')
}

/**
 * 根据zip包生成zip file
 */
function generate(zip, branch){
	zip
		.generateNodeStream({type:'nodebuffer',streamFiles:true})
		.pipe(fs.createWriteStream(path.join(releaseDir, formatBranch(branch) + POSTFIX)))
		.on('finish', function () {
		    logger.info('创建压缩文件完毕.')
		    logger.info('release成功.')
		})
}

/**
 * 格式化压缩文档中文件路径
 */
function formatZipFilePath(filepath){
	return filepath.replace(distDir,'').replace(/\\/g, path.posix.sep).replace(new RegExp('^'+path.posix.sep),'')
}
