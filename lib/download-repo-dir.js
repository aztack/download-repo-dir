const $tmp = require('tmp')
const $path = require('path')
const $shelljs = require('shelljs')
const $download = require('./download-repo.js').download

// $tmp.setGracefulCleanup()

module.exports = function downloadRepoDir (repo, targetDir, newDir, onDownloadProgress) {
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
              var newPath = $path.resolve(process.cwd(), newDir)
              if (targetDir) {
                targetDir = '/' + targetDir
              }
              $shelljs.mv(`${tmpDirName}${targetDir}`, newPath)
              try {cleanup()} catch (e) {}
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