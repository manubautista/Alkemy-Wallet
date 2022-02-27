CREATE DATABASE database_moves;

USE database_moves;
-- USERS TABLE
CREATE TABLE users(
    id INT(11) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    saldo DECIMAL(20) DEFAULT(0) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;

-- MOVES TABLES
CREATE TABLE moves (
    id INT(11) NOT NULL,
    concepto VARCHAR(150) NOT NULL,
    monto DECIMAL(20) NOT NULL,
    fecha DATE NOT NULL,
    tipo SET("INGRESO", "EGRESO") NOT NULL,
    user_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE moves
    ADD PRIMARY KEY (id);

ALTER TABLE moves
    modify ID int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

ALTER TABLE moves
    -> MODIFY fecha VARCHAR(20) NOT NULL;


ALTER TABLE moves
    -> MODIFY monto INT(20) NOT NULL;


DESCRIBE moves;