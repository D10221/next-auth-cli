# External package usage, test and Deme 

## usage
#1 Launch docker 
```
    yarn docker up -d
```
#2 Try demo
```
yarn start --databaseUrl=$DATABASE_URL_MSSQL [...options]
```
```
yarn start --databaseUrl=$DATABASE_URL_MONGODB [...options]
```
#3 Stop docker
```
yarn docker:down
```

:::NOTE
For unit tests see ../next-auth-cli  
:::