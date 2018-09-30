'use strict'

const path = require('path')
const fs = require('fs')

const homedir = require('os').homedir()
module.exports = (filePath = path.join(homedir, '.aws/credentials')) => {
  return fs.readFileSync(filePath, { 'encoding': 'utf-8' })
    .toString()
    .match(/\[(.*?)\]/g) // match returns an array of strings in square brackets e.g. ['[env1]', '[env2]']
    .map(el => { return el.slice(1, -1) }) // remove the brackets
}
