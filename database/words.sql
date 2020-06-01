CREATE TABLE words (
    id SERIAL primary key,
    word VARCHAR(255) NOT NULL,
    status VARCHAR(255),
    game_id VARCHAR(255)
);


INSERT INTO words (word, status, game_id) VALUES ('Wurmkiste', 'pile', '1');
INSERT INTO words (word, status, game_id) VALUES ('Schlafmütze', 'pile', '1');
INSERT INTO words (word, status, game_id) VALUES ('Hunger', 'guessed', '1');
INSERT INTO words (word, status, game_id) VALUES ('Leben', 'pile', '1');
