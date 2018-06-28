require('colors')
const $tmp = require('tmp')
const $shelljs = require('shelljs')
const $download = require('./download-repo.js').download

$tmp.setGracefulCleanup()

module.exports = function downloadRepoDir (repo, targetDir, newPath, onDownloadProgress) {
  return new Promise(function (resolve, reject) {
    $tmp.dir({
      unsafeCleanup: true
    }, function (err, tmpDirName, cleanup) {
      if (err) {
        reject(err)
      } else {
        $download(repo, tmpDirName).on('downloadProgress', function (data) {
          onDownloadProgress && onDownloadProgress(data)
        }).then(data => {
          try {
              $shelljs.mv(`${tmpDirName}/${targetDir}`, newPath)
              cleanup()
              resolve(data)
            } catch (e) {
              reject(e)
            }
        }).catch(err => {
          reject(err)
        })
      }
    })
  })
}