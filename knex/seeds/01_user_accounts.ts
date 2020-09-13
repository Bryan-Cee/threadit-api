import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("user_account").del();

    // Inserts seed entries
    await knex("user_account").insert([
        {
            email: "cheruiyotbryce@gmail.com",
            username: "bryce",
            verified: true,
            password: "$2b$10$h4FBz1GVS75zZnDGO9.ykOGf7eNptRrb.zYWxWSAHf7hlKL3.QbDi"
        },
        {
            email: "bryce@gmail.com",
            username: "bryce_007",
            verified: true,
            password: "$2b$10$h4FBz1GVS75zZnDGO9.ykOGf7eNptRrb.zYWxWSAHf7hlKL3.QbDi"
        },
        {
            email: "cheruiyot@gmail.com",
            username: "cheruiyot",
            verified: true,
            password: "$2b$10$h4FBz1GVS75zZnDGO9.ykOGf7eNptRrb.zYWxWSAHf7hlKL3.QbDi"
        },
    ]);

    console.log("=> run user_account seed...");
};
