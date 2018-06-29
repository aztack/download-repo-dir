# A Tool for Downloading Directories of A Git Repository

# Install

```bash
npm i dl-repo-dir
```

# Command line usage

```bash
# download and rename a directory in a repository
repo download aztack/download-repo-dir lib src/lib/new-name

# download a repository
repo download aztack/download-repo-dir '' src/lib/download-repo-dir

# download from a private gitlab repository with given tag
export GITLAB_API_PRIVATE_TOKEN=YOUR_TOKEN_HERE
repo download gitlab:mygitlab.com:topgroup/subgroup/repo#v1.0.0 dir src/lib/new-name
```

# API

`downloadRepoDir(repository, directory, saveTo, onProgress)`

```js
const downloadRepoDir = require('download-repo-dir').downloadRepoDir

console.log(`Downloading ${repo}/${dir} into ${saveTo}...`)

downloadRepoDir(repo, dir, saveTo, function (data) {
  process.stdout.write(`\rDownloaded ${(data.percent*100).toFixed(1)}%  `)
}).then(function () {
  process.stdout.write(' Done!\n')
}).catch(function (e) {
  console.log(e.message)
});
```

# Thanks

To [flipxfx/download-git-repo](https://github.com/flipxfx/download-git-repo)

# License

MIT
