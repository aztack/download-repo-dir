const $tmp = require('tmp')
const $path = require('path')
const $shelljs = require('shelljs')
const $download = require('./download-repo.js').download

// $tmp.setGracefulCleanup()

module.exports = function downloadRepoDir (repo, targetDir, newDir, onDownloadProgress, beforeMove) {
  return new Promise(function (resolve, reject) {
    $tmp.dir({}, function (err, tmpDirName) {
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
              const tmpDir = `${tmpDirName}${targetDir}`
              let doMove = true;
              if (typeof beforeMove === 'function') {
                doMove = beforeMove(tmpDir, newPath)
              } else if (typeof beforeMove === 'boolean')  {
                doMove = beforeMove;
              }
              if (doMove) $shelljs.mv(tmpDir, newPath)
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