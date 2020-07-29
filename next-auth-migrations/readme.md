# next-auth-migrations

- next-auth utility

:::  
Not really a migration tool.  
But helps you create the tables from 'code first' models.  
:::

Usage?

```bash
node_modules/.bin/next-auth-migrations --databaseUrl=mssql://test:test@localhost:1433/testdb --models=./models.js
```

NOTE:   
It's pretty much the same as running your project with '?synchronize=true'  once.

NOTE: (wip)