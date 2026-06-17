CREATE DATABASE smu8ticket;
CREATE USER admin IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON smu8ticket.* TO 'admin'@'%';

USE smu8ticket;

CREATE TABLE account(
                        id VARCHAR(36) PRIMARY KEY,
                        username VARCHAR(256) UNIQUE,
                        password VARCHAR(512),
                        nickname VARCHAR(256) UNIQUE,
                        createdAt DATETIME,
                        updatedAt DATETIME
);