import request from "supertest";
import { expect, it, describe, beforeAll, jest } from "@jest/globals";
import app from "../../app.js";
import { faker } from '@faker-js/faker';
import { prisma } from "../../config/prismaClient.js";

let account_faker_name = faker.finance.accountName();
let token;
let adminToken;
let userInformation;

beforeAll(async () => {
  const response = await request(app)
    .post("/login")
    .send({
      email: "thalysson140105@gmail.com",
      password: "Senha@12345",
    });

  expect(response.status).toBe(200);
  token = response.body.data.accessToken;
  adminToken = token;

  const adminResponse = await request(app)
    .get("/admin/users")
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${adminToken}`);
  
  if (adminResponse.status === 200 && adminResponse.body.data.length > 0) {
    adminUserId = adminResponse.body.data[0].id;
    userInformation = adminResponse.body.data[0];
  }

}, 1000);

afterAll(async () => {
  await prisma.$disconnect();
});

function getRandomAccountType() {
  const types = ["Salário", "Corrente", "Poupança"];
  return types[Math.floor(Math.random() * types.length)];
}