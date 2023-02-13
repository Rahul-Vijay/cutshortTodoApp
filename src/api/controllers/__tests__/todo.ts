import request from "supertest";
import { Express } from "express-serve-static-core";

import { createServer } from "@todoapp/utils/server";

let server: Express;

beforeAll(async () => {
  server = await createServer();
});

describe("GET /todo", () => {
  it("should return 200 & valid response if request param list is empty", (done) => {
    request(server)
      .get(`/api/v1/todo?userId=12`)
      .set("Authorization", "Bearer fakeToken")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          message: "Hello, 12, with fakeUserId!",
        });
        done();
      });
  });
  it("should return 401 & valid error response to invalid authorization token", (done) => {
    request(server)
      .get(`/api/v1/todo?userId=12`)
      .set("Authorization", "Bearer invalidFakeToken")
      .expect("Content-Type", /json/)
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: { type: "unauthorized", message: "Authentication Failed" },
        });
        done();
      });
  });

  it("should return 401 & valid error response if authorization header field is missed", (done) => {
    request(server)
      .get(`/api/v1/todo?userId=12`)
      .expect("Content-Type", /json/)
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: "request_validation",
            message: "Authorization header required",
            errors: expect.anything(),
          },
        });
        done();
      });
  });
});
