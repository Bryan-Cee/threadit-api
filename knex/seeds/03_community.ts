import * as Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
    console.log("=> seeding communities...");
    // Deletes ALL existing entries
    return knex("community").del()
      .then(async function() {
          // Inserts seed entries
          const profileIds = await knex.select("profile_id").from("user_profile");

          const communities = profileIds.map((founder_id: { profile_id: any; }) => {
              return ({
                  name: faker.name.firstName(),
                  description: faker.random.words(5),
                  founder_id: founder_id.profile_id
              })
          });

          return knex("community").insert(communities).then(() => console.log("seeding communities done..."));
      });
};
