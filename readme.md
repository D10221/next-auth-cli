# next-auth-cli (wip)

_[next-auth](https://next-auth.js.org) command line utility_

Usage?

```bash
node_modules/.bin/next-auth-cli --help
```

```
Usage:
 next-auth-cli <cmd> [args]

Commands:
  next-auth-cli sync  "synchronize database models"

Options:
  --help     Show help            [boolean]  
  --version  Show version number  [boolean]
```

## SYNC

_Syncs your models with the database_

---

```
$ next-auth-cli sync --help
```

```
sync [-u <$NEXTAUTH_URL>] [-q] [-c] [-m=</models.js>]

Options:
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
  --url, -u     Driver dependent database url
                Typically:
                <driver>://[<u>:<p>]@<server>[:port]/<dbName>[?<opt>=<val>[&<opt
                >=<val>]]
                Wellknown valid options are:
                - ?namingStrategy=<supported-next-auth-naming-strategy>
                - ?entityPrefix=<string>
                - ?synchronize=<true|false>                  [string] [required]
  --quiet, -q   Be quiet                                               [boolean]
  --ci, -c      same as --quiet, overrides $CI                         [boolean]
  --models, -m  ../path/to/my/models.js
                - As default export
                - Absolute or relative to cwd.
                - Defaults to next-auth Models                          [string]
```

### Notes:

- env vars mapping, url defaults to \$NEXTAUTH_URL:
- url options to config mapping
- ```namingStrategy``` lookup
- custom models (wip), from module `{...models}|(models)=>({...models})`

## SEED _(TODO)_

---

_seed models with your data_

```
$ next-auth-cli seed --help
```
```
$ TODO:
```

