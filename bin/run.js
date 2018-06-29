const downloadRepoDir = require('../index.js').downloadRepoDir

module.exports = run

/**
 * Download directory from repo into saveTo
 * @param  {String}   repo   [description]
 * @param  {String}   dir    [description]
 * @param  {String}   saveTo [description]
 * @param  {Function} cb     [description]
 * @return {Promise}
 */
function run (repo, dir, saveTo, cb) {
  console.log(`Downloading ${repo}/${dir} into ${saveTo}...`)
  return downloadRepoDir(repo, dir, saveTo, function (data) {
    process.stdout.write(`\rDownloaded ${(data.percent*100).toFixed(1)}%  `)
  }).then(function () {
    cb && cb(repo, dir, saveTo)
    process.stdout.write(' Done!\n')
  }).catch(function (e) {
    console.log(e.message)
  })
}