CREATE TABLE IF NOT EXISTS USER (
    serial_id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    github VARCHAR(100) NOT NULL,
    exist boolean NOT NULL,
    PRIMARY KEY (serial_id),
    UNIQUE KEY (email)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS BULLETIN (
    bulletin_serial_id INT NOT NULL AUTO_INCREMENT,
    who_write INT DEFAULT NULL,
    write_time datetime NOT NULL,
    update_time datetime DEFAULT NULL ,
    category varchar(100) NOT NULL,
    see int DEFAULT NULL,
    likes int DEFAULT NULL ,
    title varchar(100) NOT NULL ,
    content varchar(1000) DEFAULT NULL ,
    PRIMARY KEY (bulletin_serial_id),
    CONSTRAINT fk_serial_id_BULLETIN
		FOREIGN KEY (who_write)
        REFERENCES USER (serial_id)
		ON DELETE SET NULL
		ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS COMMENT (
    commnets_id int NOT NULL AUTO_INCREMENT,
    where_write_com int NOT NULL,
    comment_time datetime DEFAULT NULL,
    comment_uptime datetime DEFAULT NULL,
    who_write_com  INT DEFAULT NULL,
    start_point INT NOT NULL,
    end_point INT NOT NULL,
    content_com  varchar(500) NOT NULL,
    PRIMARY KEY (commnets_id),
    CONSTRAINT fk_serial_id_COMMNET
		FOREIGN KEY (who_write_com)
        REFERENCES USER (serial_id)
		ON DELETE SET NULL
		ON UPDATE CASCADE,
	CONSTRAINT fk_bulletin_id_COMMNET
		FOREIGN KEY (where_write_com)
        REFERENCES BULLETIN (bulletin_serial_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS COMMENT2 (
    commnets2_id int NOT NULL AUTO_INCREMENT,
    where_write_com int NOT NULL,
    comment_time datetime DEFAULT NULL,
    comment_uptime datetime DEFAULT NULL,
    who_write_com  INT DEFAULT NULL,
    content_com  varchar(500) NOT NULL,
    PRIMARY KEY (commnets2_id),
    CONSTRAINT fk_serial_id_COMMNET2
            FOREIGN KEY (who_write_com)
            REFERENCES USER (serial_id)
            ON DELETE SET NULL
            ON UPDATE CASCADE,
    CONSTRAINT fk_bulletin_id_COMMNET2
            FOREIGN KEY (where_write_com)
            REFERENCES BULLETIN (bulletin_serial_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS RECOMMEND (
	serial_like_id int NOT NULL AUTO_INCREMENT,
	where_like int NOT NULL,
	who_like   INT NOT NULL,	
	PRIMARY KEY (serial_like_id),
  	CONSTRAINT fk_serial_id_RECOMMEND
		FOREIGN KEY (who_like)
        REFERENCES USER (serial_id) 
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_bulletin_id_RECOMMEND
		FOREIGN KEY (where_like)
        REFERENCES BULLETIN (bulletin_serial_id) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
