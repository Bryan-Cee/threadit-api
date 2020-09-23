import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    return Promise.all([
        knex.raw(`ALTER TABLE user_account ENABLE TRIGGER ALL`),
        knex.raw(`ALTER TABLE user_profile ENABLE TRIGGER ALL`)
    ]).then(() => console.log("=> enabling all hidden triggers..."));
}
