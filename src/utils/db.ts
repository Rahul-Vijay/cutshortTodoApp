/* istanbul ignore file */

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);
mongoose.set("debug", process.env.DEBUG !== undefined);

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  autoIndex: true,
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

class MongoConnection {
  private static _instance: MongoConnection;

  private _mongoServer?: MongoMemoryServer;

  static getInstance(): MongoConnection {
    if (!MongoConnection._instance) {
      MongoConnection._instance = new MongoConnection();
    }
    return MongoConnection._instance;
  }

  public async open(): Promise<void> {
    try {
      console.log("connecting to inmemory mongo db");
      this._mongoServer = await MongoMemoryServer.create();
      const mongoUrl = this._mongoServer.getUri();
      await mongoose.connect(mongoUrl, opts);

      mongoose.connection.on("connected", () => {
        console.info("Mongo: connected");
      });

      mongoose.connection.on("disconnected", () => {
        console.info("Mongo: disconnected");
      });

      mongoose.connection.on("error", (err) => {
        console.error(`Mongo:  ${String(err)}`);
      });
    } catch (err) {
      console.error(`db.open: ${err}`);
      throw err;
    }
  }

  public async close(): Promise<void> {
    try {
      await mongoose.disconnect();
      await this._mongoServer!.stop();
    } catch (err) {
      console.error(`db.open: ${err}`);
      throw err;
    }
  }
}

export default MongoConnection.getInstance();
