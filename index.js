#!/usr/bin/env node

'use strict'

const clear = require('clear')
const chalk = require('chalk')
const figlet = require('figlet')
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

// read ignored directories from
// .monodignore
const ignoredDirs = [ '.git',
                      'node_modules',
                      'coverage' ]

const envs = require('./lib/readEnvs')()

clear()
console.log(
  chalk.yellow(
    figlet.textSync(`Deploy'em all!!!`, { horizontalLayout: 'full' })
  )
)

const { readdirSync, statSync } = require('fs')
const { join } = require('path')

// get all folders in current directory
// every lambda function has its own folder
// https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
// get rood directory of the project process.cwd()
const dirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory())

const deployment = () => {
  const qstns = [
    {
      type: 'checkbox',
      name: 'lambdas',
      message: 'Choose λ functions to deploy',
      choices: dirs('.').filter(elt => !ignoredDirs.includes(elt)),
    //  validate: (value) => {
    //    if (value.length) {
    //      return true
    //    }
    //    return chalk.red(`Please, choose at least one λ function. Use SPACEBAR to choose λ functions`)
    //  }
    },
    {
      type: 'list',
      name: 'env',
      message: 'Choose environment you want λ functions to be deployed to',
      choices: envs,
      default: 'dev'
    }
  ]
  return inquirer.prompt(qstns)
}


const deploy = (lambda, stage) => {
  const childProcess = spawn('sls', ['deploy', '--stage', stage, '--aws-profile', stage], { stdio: 'inherit' })
  childProcess.on('close', (code) => {
    console.log(
      chalk.magenta(`Your lambda: ${lambda} is deployed to ${stage}`)
    )
  })
  childProcess.on('error', (error) => {
    console.error(`Total fuckup: ${error}`)
  })
  process.chdir('..')
}

const run = async () => {
  const lambdas = dirs('.').filter(elt => !ignoredDirs.includes(elt))
 // if (!lambdas.length) {
 //   console.log(
 //     chalk.red(`No folders found - nothing to choose from!`)
 //   )
 //   return
 // }
  const settings = await deployment()
  for (let lambda of settings.lambdas) {
      const lambdaDir = path.join(process.cwd(), lambda)
      process.chdir(lambdaDir)
      console.log(`Deploying ${lambda} to the ${settings.env} environment`)
      deploy(lambda, settings.env)
  }
}

run()
