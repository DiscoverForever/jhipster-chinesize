#!/usr/bin/env node
const core = require('jhipster-core')
const parse = core.parse
const fs = require('fs-extra')
const path = require('path')
console.log(path.join(process.cwd(), process.argv[2]))
const jdlPath = process.argv[2]
const zhPath = process.argv[3]
const appName = process.argv[4]
const jdlStr = fs.readFileSync(path.join(process.cwd(), process.argv[2])).toString()
parse(jdlStr).entities.forEach(entity => {
  const entityLowwerName = entity.name.substring(0, 1).toLowerCase() + entity.name.substring(1, entity.name.length)
  const jsonPath = path.join(process.cwd(), zhPath, `${entityLowwerName}.json`);
  let json = fs.readJSONSync(jsonPath);
  entity.body.forEach(prop => {
    for (let key in json[appName][entityLowwerName]) {
      if (key === prop.name && prop.javadoc) {
        json[appName][entityLowwerName][key] = prop.javadoc
        json[appName][entityLowwerName]['created'] = `${entity.javadoc} {{ param }} 创建成功`
        json[appName][entityLowwerName]['updated'] = `${entity.javadoc} {{ param }} 更新成功`
        json[appName][entityLowwerName]['deleted'] = `${entity.javadoc} {{ param }} 删除成功`
        json[appName][entityLowwerName]['delete']['question'] = `你确定要删除 ${entity.javadoc} {{ id }} 吗？`
        
        json[appName][entityLowwerName]['home']['title'] = entity.javadoc
        json[appName][entityLowwerName]['detail']['title'] = entity.javadoc
        json[appName][entityLowwerName]['home']['createLabel'] = `创建新${entity.javadoc}`
        json[appName][entityLowwerName]['home']['createOrEditLabel'] = `创建或编辑${entity.javadoc}`
        json[appName][entityLowwerName]['home']['search'] = `查找${entity.javadoc}`
      }
    }
  })
  fs.writeJson(jsonPath, json)
})