import request from "supertest";
import { Express } from "express-serve-static-core";

import { createServer } from "@todoapp/utils/server";

let server: Express;

beforeAll(async () => {
  server = await createServer();
});

describe("GET /todo", () => {
  it("should return 200 & valid response if request param list is empity", (done) => {
    request(server)
      .get(`/api/v1/todo`)
      .set("Authorization", "Bearer fakeToken")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).toMatchObject({
          message: "Hello, 12345, with fakeUserId!",
        });
        done();
      });
  });
});
