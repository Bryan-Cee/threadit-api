import * as Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
    console.log("=> seeding user_profile...");
    // Deletes ALL existing entries
    return knex("user_profile").del()
      .then(async function() {
          // Inserts seed entries
          const userIds = await knex.select("user_id").from("user_account");
          const userProfiles = userIds.map(item => {
              return {
                  avatar: faker.internet.avatar(),
                  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                  bio: faker.lorem.sentence(8),
                  location: `${faker.address.city()}, ${faker.address.country()}`,
                  user_id: item.user_id
              };
          });

          return knex("user_profile").insert(userProfiles);
      });
};
