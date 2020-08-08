# next-auth-cli (wip)

_[next-auth](https://next-auth.js.org) command line utility_

### Installation
Until there is a package it can be installed as follows
```
yarn add https://github.com/D10221/next-auth-cli/releases/download/v0.1.0-1/next-auth-cli-v0.1.0-1.tgz
```

### Usage

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

NOTES:

For the sync command to work with a custom adapter,
the custom adapter should 'honnor' the 'synchronize' flag
that would be provided by the command to the `adapter.getAdapter` implementation.  
Or accept 'database' as 1st parameters, as initialization options,
but only when the adapter was provided by the `--adapter` sync's command's option.

'next-auth' won't initialize the custom adapter, but simply call it with the appOptions as parameter.

'next-auth-cli' will try to initialize the 'adapter' if the adapter does not have a 'getAdapter' member function

So in effect, for a custom adapter to be 'syncable' its has to accept synchonize on 'getAdapter'
perhaps exists in a different 'module/file' and passed down as cli flag.

```
cli --adapter=my/adapter.js
```

For more details see [test adapter and configuration](test/readme.md)
