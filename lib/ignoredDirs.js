'use strict'

const path = require('path')
const fs = require('fs')

const projectDir = process.cwd()

const defaultIgnore = [
  'node_modules',
  '__tests__',
  'coverage',
  '.git'
]

const ignoredDirs = (filePath = path.join(projectDir, '.monodignore')) => {
  let projectIgnore = []

  try {
    if (fs.existsSync(filePath)) {
      projectIgnore = fs.readFileSync(filePath, { 'encoding': 'utf-8' })
        .toString()
        .split(/\r?\n/)
        .filter(el => el.trim() !== '' && el.charAt(0) !== '#')
    }
  } catch (err) {
    console.error(err)
  }

  return [...new Set(defaultIgnore.concat(projectIgnore))]
}

module.exports = ignoredDirs
