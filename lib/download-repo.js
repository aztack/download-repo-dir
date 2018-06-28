var $download = require('download')
var $shelljs = require('shelljs')

const api = {
  WellKnowns: {
    github: 'github.com',
    gitlab: 'gitlab.com',
    bitbucket: 'bitbucket'
  },
  ZipUrlGen: {
    github: function (origin, repoInfo) {
      return origin + repoInfo.owner + '/' + repoInfo.name + '/archive/' + repoInfo.branch + '.zip'
    },
    gitlab: function (origin, repoInfo) {
      return origin + repoInfo.owner + '/' + repoInfo.name + '/repoInfository/archive.zip?ref=' + repoInfo.branch
    },
    bitbucket: function (origin, repoInfo) {
      return origin + repoInfo.owner + '/' + repoInfo.name + '/get/' + repoInfo.branch + '.zip'
    }
  },
  DefaultDownloadOpts: {
    extract: true,
    headers: {
      accept: 'application/zip'
    },
    mode: '666',
    strip: 1
  },
  download: function(repo, dest, opts) {
    if (typeof opts === 'function') {
      fn = opts
      opts = null
    }
    opts = opts || {}
    const repoInfo = normalize(repo)
    var url = getZipUrl(repoInfo)
    return $download(url, dest, api.DefaultDownloadOpts)
  }
}


function normalize(repoUrl) {
  var wellKnowns = Object.keys(api.WellKnowns).join('|')
  var regex = new RegExp(`^((${wellKnowns}):)?((.+):)?([^/]+)\/([^#]+)(#(.+))?$`)
  var match = regex.exec(repoUrl)
  var type = match[2] || 'github'
  var origin = match[4] || null
  var owner = match[5]
  var name = match[6]
  var branch = match[8] || 'master'

  if (origin == null) {
    origin = api.WellKnowns[type] || api.WellKnowns.github
  }

  return {
    branch: branch,
    name: name,
    origin: origin,
    owner: owner,
    type: type
  }
}


function fixProtocol(origin) {
  return !/^(f|ht)tps?:\/\//i.test(origin) ? 'https://' + origin : origin
}

function getZipUrl(repoInfo) {
  var origin = fixProtocol(repoInfo.origin)
  origin += origin.match(/^git\@/i) ? ':' : '/'

  var zipUrlGenFn = api.ZipUrlGen[repoInfo.type]
  if (typeof zipUrlGenFn !== 'function') {
    throw new Error(`Do not support ${type}!`)
  }
  return zipUrlGenFn(origin, repoInfo)
}

module.exports = api