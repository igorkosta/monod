#!/usr/bin/env node

'use strict'

const clear = require('clear')
const chalk = require('chalk')
const figlet = require('figlet')
const inquirer = require('inquirer')
const commander = require('commander')
const path = require('path')
const { spawn } = require('child_process')

// read ignored directories from
// .monodignore
const ignoredDirs = require('./lib/ignoredDirs.js')()
const envs = require('./lib/readEnvs.js')()
const regions = require('./lib/awsRegions.js')

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
      choices: dirs('.').filter(elt => !ignoredDirs.includes(elt))
    },
    {
      type: 'list',
      name: 'env',
      message: 'Choose environment you want λ functions to be deployed to',
      choices: envs,
      default: 'dev'
    },
    {
      type: 'list',
      name: 'region',
      message: 'Choose region you want your λ functions to be deployed to',
      choices: regions,
      pageSize: 15
    }
  ]
  return inquirer.prompt(qstns)
}

const deploy = (lambda, stage, region) => {
  const childProcess = spawn('sls', ['deploy', '--stage', stage, '--aws-profile', stage, '--region', region], { stdio: 'inherit' })
  childProcess.on('close', (code) => {
    console.log(
      chalk.magenta(`Your lambda: ${lambda} is deployed to ${stage} in ${region}`)
    )
  })
  childProcess.on('error', (error) => {
    console.error(`Total fuckup: ${error}`)
  })
  process.chdir('..')
}

const runWithParams = () => {
  commander
    .command('deploy')
    .alias('d')
    .description('Deploy your λ functions with one line')
    .option('-f, --functions [array of functions]', 'e.g. apps,instances')
    .option('-p, --profile [AWS profile]', 'e.g. arivalstage')
    .option('-r, --region [AWS region]', 'e.g. us-east-1')
    .action(function (args) {
      console.log('-------------------------')
      console.object(args)
    })
}

const run = async () => {
  // check the params - if there're none run the inquirer

  const settings = await deployment()
  if (!settings.lambdas) {
    return console.error(`You have to choose at least one lambda function!`)
  }
  console.log(`SETTINGS: ${JSON.stringify(settings)}`)
  for (let lambda of settings.lambdas) {
    const lambdaDir = path.join(process.cwd(), lambda)
    process.chdir(lambdaDir)
    console.log(`Deploying ${lambda} to the ${settings.env} environment in region ${settings.region}`)
    deploy(lambda, settings.env, settings.region)
  }
}

run()
