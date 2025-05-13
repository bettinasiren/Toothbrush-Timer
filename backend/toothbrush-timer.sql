DROP TABLE IF EXISTS avatars CASCADE;
DROP TABLE IF EXISTS user_medals CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS medals CASCADE;

CREATE TABLE avatars (
  id SERIAL PRIMARY KEY,
  avatar TEXT
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT UNIQUE NOT NULL CHECK(length (password) >= 6),
  email TEXT UNIQUE NOT NULL,
  avatar_id INT,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_avatar FOREIGN KEY (avatar_id) REFERENCES avatars (id)
);

CREATE TABLE medals (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  criteria TEXT NOT NULL
);

CREATE TABLE user_medals(
  id SERIAL PRIMARY KEY,
  user_id INT,
  medal_id INT,
  CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT fk_medals FOREIGN KEY (medal_id) REFERENCES medals (id)
)

INSERT INTO avatars (avatar) VALUES (''),(''),(''),(''),('')

INSERT INTO medals (name, image, criteria) VALUES (''),(''),(''),('')

INSERT INTO user_medals(user_id, medal_id) VALUES (''),(''),
