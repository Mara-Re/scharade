DROP TABLE IF EXISTS words;

CREATE TABLE words (
    id SERIAL primary key,
    word VARCHAR(255) NOT NULL,
    status VARCHAR(255),
    game_uid VARCHAR(255),
    player_id INT REFERENCES players(id),
    drawn_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    player_word_index INT
);


INSERT INTO words (word, status, game_id) VALUES ('Wurmkiste', 'pile', '1');
INSERT INTO words (word, status, game_id) VALUES ('Schlafmütze', 'pile', '1');
INSERT INTO words (word, status, game_id) VALUES ('Hunger', 'guessed', '1');
INSERT INTO words (word, status, game_id) VALUES ('Leben', 'pile', '1');
