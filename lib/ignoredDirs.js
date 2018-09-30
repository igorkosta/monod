'use strict'

const path = require('path')
const fs = require('fs')

const projectDir = process.cwd()

const defaultIgnore = fs.readFileSync('../.monodignore', { 'encoding': 'utf-8' })
  .toString()
  .split('\n')
  .slice(0, -1)

console.log(defaultIgnore.toString().split('\n').slice(0, -1))

const ignoredDirs = (filePath = path.join(projectDir, '.monodignore')) => {
  const projectIgnore = fs.readFileSync(filePath, { 'encoding': 'utf-8' })
    .toString()
    .split('\n')
    .slice(0, -1)
  return [...new Set(defaultIgnore.concat(projectIgnore))]
}

module.exports = ignoredDirs
