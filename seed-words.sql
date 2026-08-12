-- Seed Words and Achievements for WordForge
-- Run this in Neon SQL Editor

-- Insert EASY words
INSERT INTO "Word" (id, word, length, difficulty, definition, "partOfSpeech", examples, synonyms, "createdAt", "updatedAt") VALUES
('word1', 'word', 4, 'EASY', 'A unit of language', 'noun', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('play1', 'play', 4, 'EASY', 'To engage in activity for enjoyment', 'verb', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('game1', 'game', 4, 'EASY', 'A form of competitive activity', 'noun', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('time1', 'time', 4, 'EASY', 'The indefinite continued progress of existence', 'noun', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('make1', 'make', 4, 'EASY', 'To form or create something', 'verb', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('take1', 'take', 4, 'EASY', 'To lay hold of', 'verb', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('work1', 'work', 4, 'EASY', 'Activity involving mental or physical effort', 'noun', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('find1', 'find', 4, 'EASY', 'To discover or perceive by chance', 'verb', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('give1', 'give', 4, 'EASY', 'To freely transfer possession', 'verb', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('tell1', 'tell', 4, 'EASY', 'To communicate information', 'verb', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('call1', 'call', 4, 'EASY', 'To speak loudly to attract attention', 'verb', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('hand1', 'hand', 4, 'EASY', 'The end part of an arm', 'noun', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('home1', 'home', 4, 'EASY', 'The place where one lives', 'noun', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('back1', 'back', 4, 'EASY', 'The rear surface of the human body', 'noun', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('come1', 'come', 4, 'EASY', 'To move toward something', 'verb', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW())
ON CONFLICT (word) DO NOTHING;

-- Insert MEDIUM words
INSERT INTO "Word" (id, word, length, difficulty, definition, "partOfSpeech", examples, synonyms, "createdAt", "updatedAt") VALUES
('world1', 'world', 5, 'MEDIUM', 'The earth and all its inhabitants', 'noun', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('about1', 'about', 5, 'MEDIUM', 'Concerning or regarding', 'preposition', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('think1', 'think', 5, 'MEDIUM', 'To have a particular opinion', 'verb', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('after1', 'after', 5, 'MEDIUM', 'In the time following', 'preposition', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('place1', 'place', 5, 'MEDIUM', 'A particular position or location', 'noun', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('right1', 'right', 5, 'MEDIUM', 'Morally good or correct', 'adjective', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('small1', 'small', 5, 'MEDIUM', 'Of limited size', 'adjective', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('great1', 'great', 5, 'MEDIUM', 'Of an extent or intensity above normal', 'adjective', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('where1', 'where', 5, 'MEDIUM', 'In or to what place or position', 'adverb', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('every1', 'every', 5, 'MEDIUM', 'Used to refer to all members of a group', 'determiner', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW())
ON CONFLICT (word) DO NOTHING;

-- Insert HARD words
INSERT INTO "Word" (id, word, length, difficulty, definition, "partOfSpeech", examples, synonyms, "createdAt", "updatedAt") VALUES
('through1', 'through', 7, 'HARD', 'Moving in one side and out of the other', 'preposition', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('between1', 'between', 7, 'HARD', 'At or to a point in the middle', 'preposition', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('another1', 'another', 7, 'HARD', 'Used to refer to an additional person', 'determiner', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('nothing1', 'nothing', 7, 'HARD', 'Not anything', 'pronoun', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('against1', 'against', 7, 'HARD', 'In opposition to', 'preposition', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('because1', 'because', 7, 'HARD', 'For the reason that', 'conjunction', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('without1', 'without', 7, 'HARD', 'In the absence of', 'preposition', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('brought1', 'brought', 7, 'HARD', 'Past tense of bring', 'verb', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('thought1', 'thought', 7, 'HARD', 'Past tense of think', 'verb', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('special1', 'special', 7, 'HARD', 'Better or different from usual', 'adjective', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW())
ON CONFLICT (word) DO NOTHING;

-- Insert EXPERT words
INSERT INTO "Word" (id, word, length, difficulty, definition, "partOfSpeech", examples, synonyms, "createdAt", "updatedAt") VALUES
('question1', 'question', 8, 'EXPERT', 'A sentence worded to elicit information', 'noun', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('interest1', 'interest', 8, 'EXPERT', 'The state of wanting to know', 'noun', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('possible1', 'possible', 8, 'EXPERT', 'Able to be done', 'adjective', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('together1', 'together', 8, 'EXPERT', 'With or in proximity to another', 'adverb', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW()),
('remember1', 'remember', 8, 'EXPERT', 'Have in or be able to bring to mind', 'verb', ARRAY[]::text[], ARRAY[]::text[], NOW(), NOW())
ON CONFLICT (word) DO NOTHING;

-- Insert Achievements
INSERT INTO "Achievement" (id, name, title, description, icon, category, requirement, "xpReward", "coinReward", rarity) VALUES
('ach1', 'first_win', 'First Victory', 'Win your first game', '🎯', 'milestone', 1, 50, 10, 'COMMON'),
('ach2', 'win_streak_5', 'On Fire', 'Win 5 games in a row', '🔥', 'streak', 5, 150, 25, 'RARE'),
('ach3', 'perfect_game', 'Perfect', 'Win a game on the first guess', '💎', 'skill', 1, 200, 50, 'EPIC'),
('ach4', 'games_played_100', 'Dedicated', 'Play 100 games', '🏆', 'milestone', 100, 300, 75, 'LEGENDARY')
ON CONFLICT (name) DO NOTHING;
