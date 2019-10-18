/* eslint-disable max-len */

const ON_INSERT_FOLLOW_FUNCTION = `
    CREATE OR REPLACE FUNCTION toggle_follow(pid NUMERIC, fid NUMERIC)
    RETURNS RECORD AS $$
    DECLARE
        row_exists NUMERIC;
        follow_obj RECORD;
    BEGIN
        SELECT 1 INTO row_exists FROM user_followers WHERE profile_id = pid and follower_id = fid;
        IF (row_exists > 0) THEN
            DELETE FROM user_followers WHERE profile_id = pid AND follower_id = fid;
            SELECT COUNT(*) as total_followers,
            EXISTS(
                SELECT *
                FROM user_followers
                WHERE profile_id = pid
                AND follower_id = fid
            ) AS followed
            INTO follow_obj
            FROM user_followers WHERE profile_id = pid;
            RETURN follow_obj;
        ELSE
            INSERT INTO user_followers(profile_id, follower_id) VALUES(pid, fid);
            SELECT COUNT(*) as total_followers,
            EXISTS(
                SELECT *
                FROM user_followers
                WHERE profile_id = pid
                AND follower_id = fid
            ) AS followed
            INTO follow_obj
            FROM user_followers WHERE profile_id = pid;
            RETURN follow_obj;
        END IF;
    END;
    $$
    LANGUAGE plpgsql;
`;

exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable("user_followers", function(t) {
      t.integer("profile_id").references("profile_id").inTable("user_profile");
      t.integer("follower_id").references("profile_id").inTable("user_profile");

      t.primary(["profile_id", "follower_id"])
        .unique(["profile_id", "follower_id"]);
    }).then(() => console.log("=> User_followers table created...")),
    knex.raw(ON_INSERT_FOLLOW_FUNCTION)
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.raw("DROP FUNCTION toggle_follow(pid NUMERIC, fid NUMERIC)"),
    knex.schema.dropTable("user_followers")
  ]);
};
