#!/usr/bin/env node

const LocalDistDeployPlugin = require('../dist/main.cjs.js')

const LocalDistDeploy = new LocalDistDeployPlugin()
LocalDistDeploy.apply()
