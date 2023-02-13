import express from "express";
import { Express } from "express-serve-static-core";
import { connector, summarise } from "swagger-routes-express";
import YAML from "yamljs";
import * as OpenApiValidator from "express-openapi-validator";
import * as api from "@todoapp/api/controllers";

export async function createServer(): Promise<Express> {
  const yamlSpecFile = "./config/openapi.yml";
  const apiDefinition = YAML.load(yamlSpecFile);
  const apiSummary = summarise(apiDefinition);
  console.info(apiSummary);

  const server = express();

  // OPEN API Validation object
  const validatorOptions = {
    apiSpec: yamlSpecFile,
    validateRequests: true,
    validateResponses: true,
  };

  server.use(OpenApiValidator.middleware(validatorOptions));

  // error customization, if request is invalid
  server.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      res.status(err.status).json({
        error: {
          type: "request_validation",
          message: err.message,
          errors: err.errors,
        },
      });
    }
  );

  const connect = connector(api, apiDefinition, {
    onCreateRoute: (method: string, descriptor: any[]) => {
      console.log(
        `${method}: ${descriptor[0]} : ${(descriptor[1] as any).name}`
      );
    },
    security: {
      bearerAuth: api.auth,
    },
  });

  connect(server);

  return server;
}
