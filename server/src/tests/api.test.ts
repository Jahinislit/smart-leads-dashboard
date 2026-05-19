import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Express } from "express";
import type { LeadSource, LeadStatus } from "../models/Lead";

interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      role: "admin" | "sales";
    };
  };
}

interface LeadResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    status: LeadStatus;
    source: LeadSource;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface LeadListResponse {
  success: boolean;
  data: LeadResponse["data"][];
  meta: NonNullable<LeadResponse["meta"]>;
}

process.env.JWT_SECRET = "test-secret-for-api-suite";
process.env.JWT_EXPIRES_IN = "1d";
process.env.CLIENT_URL = "http://localhost:5173";

let app: Express;
let mongo: MongoMemoryServer;

const register = async (role: "admin" | "sales") => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: role === "admin" ? "Admin User" : "Sales User",
      email: `${role}@example.com`,
      password: "Password123!",
      role
    })
    .expect(201);

  return response.body as AuthResponse;
};

const createLead = async (token: string, index: number, overrides: Partial<{ status: LeadStatus; source: LeadSource; name: string }> = {}) => {
  const response = await request(app)
    .post("/api/leads")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: overrides.name ?? `Rahul Lead ${index}`,
      email: `lead${index}@example.com`,
      status: overrides.status ?? "New",
      source: overrides.source ?? "Website"
    })
    .expect(201);

  return response.body as LeadResponse;
};

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri();
  await mongoose.connect(process.env.MONGO_URI);
  const imported = await import("../app");
  app = imported.app;
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe("Smart Leads API", () => {
  it("registers and logs in users with JWT auth", async () => {
    const registered = await register("admin");
    expect(registered.data.token).toBeTruthy();
    expect(registered.data.user.role).toBe("admin");

    const login = await request(app).post("/api/auth/login").send({ email: "admin@example.com", password: "Password123!" }).expect(200);
    expect((login.body as AuthResponse).data.token).toBeTruthy();
  });

  it("protects lead routes and supports CRUD", async () => {
    await request(app).get("/api/leads").expect(401);
    const admin = await register("admin");
    const created = await createLead(admin.data.token, 1, { status: "Qualified", source: "Instagram" });

    await request(app).get(`/api/leads/${created.data._id}`).set("Authorization", `Bearer ${admin.data.token}`).expect(200);

    const updated = await request(app)
      .patch(`/api/leads/${created.data._id}`)
      .set("Authorization", `Bearer ${admin.data.token}`)
      .send({ status: "Contacted" })
      .expect(200);
    expect((updated.body as LeadResponse).data.status).toBe("Contacted");

    await request(app).delete(`/api/leads/${created.data._id}`).set("Authorization", `Bearer ${admin.data.token}`).expect(200);
  });

  it("combines search, status, source, sorting, and backend pagination", async () => {
    const admin = await register("admin");
    for (let index = 1; index <= 12; index += 1) {
      await createLead(admin.data.token, index, {
        name: index % 2 === 0 ? `Rahul Qualified ${index}` : `Meera New ${index}`,
        status: index % 2 === 0 ? "Qualified" : "New",
        source: index % 2 === 0 ? "Instagram" : "Website"
      });
    }

    const pageOne = await request(app).get("/api/leads?page=1").set("Authorization", `Bearer ${admin.data.token}`).expect(200);
    expect((pageOne.body as LeadListResponse).data).toHaveLength(10);
    expect((pageOne.body as LeadListResponse).meta.total).toBe(12);
    expect((pageOne.body as LeadListResponse).meta.limit).toBe(10);

    const filtered = await request(app)
      .get("/api/leads?status=Qualified&source=Instagram&search=Rahul&sort=oldest")
      .set("Authorization", `Bearer ${admin.data.token}`)
      .expect(200);
    const body = filtered.body as LeadListResponse;
    expect(body.meta.total).toBe(6);
    expect(body.data.every((lead) => lead.status === "Qualified" && lead.source === "Instagram" && lead.name.includes("Rahul"))).toBe(true);
  });

  it("enforces admin-only delete and exports CSV", async () => {
    const admin = await register("admin");
    const sales = await register("sales");
    const created = await createLead(admin.data.token, 1, { status: "Qualified", source: "Instagram" });

    await request(app).delete(`/api/leads/${created.data._id}`).set("Authorization", `Bearer ${sales.data.token}`).expect(403);

    const csv = await request(app).get("/api/leads/export?status=Qualified&source=Instagram").set("Authorization", `Bearer ${sales.data.token}`).expect(200);
    expect(csv.text).toContain("Name,Email,Status,Source,Created At");
    expect(csv.text).toContain("lead1@example.com");
  });
});
