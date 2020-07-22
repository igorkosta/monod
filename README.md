# monod [![npm version](https://badge.fury.io/js/monod.svg)](https://badge.fury.io/js/monod)
# Why
If you use a `monorepo` to manage your lambda functions and every lambda
function has its own folder - you can use `monod` to deploy them.

# How
```sh
npm i -D monod
```

`monod` is built on certain assumptions. It assumes that every lambda function has its own folder.

If you run `monod` without any parameters it will show you all folders in
current directoy and let you choose which ones to deploy.

```sh
$ monod
```

Alternatively you can pass a folder to `monod`, where you lambda functions are located:

```sh
monod lambdas
```

If you want to ignore certain folders put them into the `.monodignore` folder.

Following folders are ignored per default:
```js
const defaultIgnore = [
  'node_modules',
  '__tests__',
  'coverage',
  '.git'
]
```

# TODOs
- [ ] Check if any of the available lambdas has been chosen (don't allow empty choice)
- [ ] Get the list of aws-regions

