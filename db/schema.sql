CREATE DATABASE reellife;

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title TEXT,
    date TEXT,
    img_url TEXT,
    description TEXT,
    user_id INTEGER NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name TEXT,
    email TEXT,
    password_digest TEXT
);

INSERT INTO posts (title, date, img_url, description, user_id) VALUES ('Swan River Adventure', '27 September 2023', 'https://media.newyorker.com/photos/5909808f019dfc3494ea40e2/master/w_2240,c_limit/Collier-Tinder-Guy-Holding-a-Fish.jpg', 'Captured in this image is a moment of pride and accomplishment, as the subject, beaming with a satisfied smile, holds up a freshly caught fish. The sunlight gently illuminates the scene, casting a warm glow on the faces and enhancing the natural colors of the surroundings. The water glistens in the background, providing a serene backdrop to this memorable outdoor adventure.', 1);