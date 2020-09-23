import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    return Promise.all([
        knex.raw("ALTER TABLE user_account DISABLE TRIGGER ALL"),
        knex.raw("ALTER TABLE user_profile DISABLE TRIGGER ALL")
    ]).then(() => console.log("=> disabling all hidden triggers..."));
}
