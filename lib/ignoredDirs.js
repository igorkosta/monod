'use strict'

const path = require('path')
const fs = require('fs')

const projectDir = process.cwd()

const defaultIgnore = fs.readFileSync('./.monodignore', { 'encoding': 'utf-8' })
  .toString()
  .split(/\r?\n/)
  // should remove comments and empty lines
  .filter(el => el.trim() !== '' && el.charAt(0) !== '#')

const ignoredDirs = (filePath = path.join(projectDir, '.monodignore')) => {
  const projectIgnore = fs.readFileSync(filePath, { 'encoding': 'utf-8' })
    .toString()
    .split(/\r?\n/)
    .filter(el => el.trim() !== '' && el.charAt(0) !== '#')
  return [...new Set(defaultIgnore.concat(projectIgnore))]
}

module.exports = ignoredDirs
