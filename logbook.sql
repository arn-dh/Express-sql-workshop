CREATE TABLE IF NOT EXISTS mylogbook (
id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
jump_height INT,
jump_location VARCHAR(64),
jump_date DATE,
jumper_alive BOOLEAN NOT NULL
);

INSERT INTO mylogbook
(jump_height, jump_location, jump_date, jumper_alive )
VALUES
(300,
"Rio De Janeiro",
"2019-02-24",
1),
(160,
"Millau",
"2020-03-02",
1),
(160,
"Millau",
"2020-03-02",
1),
(160,
"Millau",
"2020-03-02",
1),
(160,
"Millau",
"2020-03-02",
1),
(280,
"Millau",
"2020-03-02",
1)
;
