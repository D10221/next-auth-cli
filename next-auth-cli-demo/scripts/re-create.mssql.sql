USE master;  
GO
if not exists (select name from sys.syslogins where name = 'nextauth')
CREATE LOGIN nextauth   
    WITH PASSWORD = 'nextauth';  
go
USE nextauth;  
GO
drop user if exists nextauth
go
use master
GO
if exists (select name from sys.databases where name = 'nextauth' )
drop database nextauth
go
if not exists (select name from sys.databases where name = 'nextauth' )
create database nextauth
go
USE nextauth;  
CREATE USER nextauth FOR LOGIN nextauth   
    WITH DEFAULT_SCHEMA =[dbo];  
GO
EXEC sp_addrolemember N'db_owner', 'nextauth'  
