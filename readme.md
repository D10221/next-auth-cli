# next-auth-cli (wip)

![Node.js CI](https://github.com/D10221/next-auth-cli/workflows/Node.js%20CI/badge.svg)

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
  --help     Show help [boolean]
  --version  Show version number  [boolean]
```

## SYNC

_Syncs your models with the database_

---

```
$ next-auth-cli sync --help
```

```
next-auth-cli sync [config] [...options]

Positionals:
  config  ../path/to/my/configuration.js
          Optional: if '--adapter' or '--database' provided.            [string]

Options:
  --help            Show help                                          [boolean]
  --version         Show version number                                [boolean]
  --database, --db  Driver dependent database URL
                    OR ../path/to/my/database-configuration.js
                    if protocol is 'file://'
                    - Overrides config.database                         [string]
  --adapter, -a     ../path/to/my/adapter.js
                    - Absolute or relative to cwd.
                    - Defaults to next-auth Default adapter- Overrides
                    config.adapter                                      [string]
  --quiet, -q       Be quiet                                           [boolean]
  --ci, -c          same as --quiet, overrides $CI                     [boolean]
```

## SEED _(TODO)_

---

_seed models with your data_

```
$ next-auth-cli seed --help
```

```
$ TODO:
```

## Debug

---

```sh
# namespaced
DEBUG=next-auth-cli:*
```
___

[See more ...](./next-auth-cli/readme.md)