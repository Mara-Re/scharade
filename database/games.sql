CREATE TABLE games (
    id SERIAL primary key,
    status VARCHAR(255),
    player_explaining_id VARCHAR(255),
    timer_id VARCHAR(255)
);


INSERT INTO games (status) VALUES ('start');