import request from "supertest";
import { Express } from "express-serve-static-core";

import { createServer } from "@todoapp/utils/server";
import db from "@todoapp/utils/db";

let server: Express;

beforeAll(async () => {
  server = await createServer();
  await db.open();
});

afterAll(async () => {
  await db.close();
});

describe("POST /todo", () => {
  it("should return 201 & valid response if post body is correct", (done) => {
    request(server)
      .post(`/api/v1/newTodo`)
      .set("Authorization", "Bearer fakeToken")
      .send({
        text: "new text",
        userId: "123",
      })
      .expect("Content-Type", /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          message: "Todo Created",
          id: expect.any(String),
        });
        done();
      });
  });

  it("should return 401 & invalid response if post body is incorrect", (done) => {
    request(server)
      .post(`/api/v1/newTodo`)
      .set("Authorization", "Bearer fakeToken")
      .send({
        text: "",
        userId: "123",
      })
      .expect("Content-Type", /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          message: expect.any(String),
          fn: "postTodo",
        });
        done();
      });
  });
});

describe("PATCH /todo", () => {
  it("should return 200 & valid response for updating text", (done) => {
    request(server)
      .post(`/api/v1/newTodo`)
      .set("Authorization", "Bearer fakeToken")
      .send({
        text: "new text",
        userId: "123",
      })
      .end((err, res) => {
        request(server)
          .patch(`/api/v1/updateTodoText`)
          .set("Authorization", "Bearer fakeToken")
          .send({
            text: "new text 2",
            todoId: res.body.id,
          })
          .expect("Content-Type", /json/)
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toMatchObject({
              message: "Todo Text Updated",
              status: true,
            });
            done();
          });
      });
  });

  it("should return 400 & invalid response for bad request", (done) => {
    request(server)
      .post(`/api/v1/newTodo`)
      .set("Authorization", "Bearer fakeToken")
      .send({
        text: "new text",
        userId: "123",
      })
      .end((err, res) => {
        request(server)
          .patch(`/api/v1/updateTodoText`)
          .set("Authorization", "Bearer fakeToken")
          .send({
            text: "",
            todoId: "",
          })
          .expect("Content-Type", /json/)
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toMatchObject({
              fn: "updateTodo",
              message: expect.any(String),
            });
            done();
          });
      });
  });

  it("should return 200 & valid response for updating status", (done) => {
    request(server)
      .post(`/api/v1/newTodo`)
      .set("Authorization", "Bearer fakeToken")
      .send({
        text: "new text",
        userId: "123",
      })
      .end((err, res) => {
        request(server)
          .patch(`/api/v1/updateTodoStatus`)
          .set("Authorization", "Bearer fakeToken")
          .send({
            completed: true,
            todoId: res.body.id,
          })
          .expect("Content-Type", /json/)
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toMatchObject({
              message: "Todo Status Updated",
              status: true,
            });
            done();
          });
      });
  });
});
