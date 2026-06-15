CREATE DATABASE smu8ticket;
CREATE USER admin IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON smu8ticket.* TO 'admin'@'%';
