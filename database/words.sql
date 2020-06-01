CREATE TABLE words (
    id SERIAL primary key,
    word VARCHAR(255) NOT NULL,
    status VARCHAR(255)
);


INSERT INTO words (word, status) VALUES ('Wurmkiste', 'pile');
INSERT INTO words (word, status) VALUES ('Schlafmütze', 'pile');
INSERT INTO words (word, status) VALUES ('Hunger', 'guessed');
INSERT INTO words (word, status) VALUES ('Leben', 'pile');
