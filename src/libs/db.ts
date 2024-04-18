import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { server } from "../server";

export function useDataBase() {
  mongoose.set("strictQuery", true);
  return mongoose.connect(process.env.DATABASE_ENDPOINT || "");
}

let mongoServer: MongoMemoryServer;

class TestDB {
  async connect() {
    mongoServer = await MongoMemoryServer.create({});
    const mongoUri = mongoServer.getUri();
    return mongoose.connect(mongoUri);
  }

  async disconnect() {
    await mongoose.disconnect();
    server.close();
    return await mongoServer.stop();
  }

  request(): request.SuperTest<request.Test> {
    //@ts-ignore
    return request(server);
  }
}

export const testDB = new TestDB();
