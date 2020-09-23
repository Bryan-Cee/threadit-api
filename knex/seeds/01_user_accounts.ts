import * as Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("user_account").del();

    const users = [
        {
            email: "cheruiyotbryce@gmail.com",
            username: "bryce",
            verified: true,
            password: "$2b$10$"
        },
        {
            email: "bryce@gmail.com",
            username: "bryce_007",
            verified: true,
            password: "$2b$10$"
        },
        {
            email: "cheruiyot@gmail.com",
            username: "cheruiyot",
            verified: false,
            password: "$2b$10"
        },
    ];

    for (let i = 0; i < 7; i++) {
        users.push({
            email: faker.internet.email(),
            username: faker.internet.userName(),
            verified: false,
            password: faker.internet.password()
        })
    }
    // Inserts seed entries
    await knex("user_account").insert(users);

    console.log("=> seeding user_account...");
};
