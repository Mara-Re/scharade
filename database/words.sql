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
