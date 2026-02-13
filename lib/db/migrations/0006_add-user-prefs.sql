INSERT INTO `userPreferences` (user_id)
SELECT
    id
FROM `user`
WHERE id NOT IN (SELECT user_id FROM `userPreferences`);