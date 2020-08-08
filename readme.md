# next-auth-cli (wip)

![Node.js CI](https://github.com/D10221/next-auth-cli/workflows/Node.js%20CI/badge.svg)

_[next-auth](https://next-auth.js.org) command line utility_

### Installation
Until there is a package it can be installed as follows
```
yarn add https://github.com/D10221/next-auth-cli/releases/download/v0.1.0-1/next-auth-cli-v0.1.0-1.tgz
```

Usage

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
          Optional: if '--adapter' or '--database' provided.
Options:
  --database, --db  DB Url
    '<driver>://[<credentials>@]<host>/<db>[?<option>=<value>];'
    'file://./path/to/db-conf.js'
    - Overrides config.database    

  --adapter, -a     '../path/to/my/adapter.js'
    - Absolute or relative to cwd.
    - Defaults to next-auth Default adapter
    - Overrides config.adapter

  --help            Show help
  --quiet, -q       Be quiet
  --ci, -c          same as --quiet, overrides $CI
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

---

[See more ...](./next-auth-cli/readme.md)
