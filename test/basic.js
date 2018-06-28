const downloadRepoDir = require('../index.js').downloadRepoDir
const repo = 'lingobus/generator-mpa'
const dir = 'dialog'
const into = `${__dirname}/tmp/dlg`
console.log(`Downloading ${repo}/${dir} into ${into}...`)
downloadRepoDir(repo, dir, into, function (data) {
  process.stdout.write(`\rDownloaded:${(data.percent*100).toFixed(1)}%  `)
}).then(function () {
  console.log('Done!')
}).catch(function (e) {
  console.log(e.message)
})