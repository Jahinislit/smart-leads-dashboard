import mongoose from "mongoose";
import { connectDb } from "./config/db";
import { Lead, type LeadSource, type LeadStatus } from "./models/Lead";
import { User } from "./models/User";

interface SeedLead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

const sampleLeads: SeedLead[] = [
  { name: "Rahul Sharma", email: "rahul.sharma@example.com", status: "Qualified", source: "Instagram" },
  { name: "Priya Mehta", email: "priya.mehta@example.com", status: "New", source: "Website" },
  { name: "Aman Verma", email: "aman.verma@example.com", status: "Contacted", source: "Referral" },
  { name: "Sneha Kapoor", email: "sneha.kapoor@example.com", status: "Lost", source: "Instagram" },
  { name: "Rohan Gupta", email: "rohan.gupta@example.com", status: "Qualified", source: "Website" },
  { name: "Ananya Singh", email: "ananya.singh@example.com", status: "New", source: "Referral" },
  { name: "Karan Malhotra", email: "karan.malhotra@example.com", status: "Contacted", source: "Website" },
  { name: "Neha Iyer", email: "neha.iyer@example.com", status: "Qualified", source: "Instagram" },
  { name: "Vikram Rao", email: "vikram.rao@example.com", status: "Lost", source: "Referral" },
  { name: "Meera Nair", email: "meera.nair@example.com", status: "New", source: "Instagram" },
  { name: "Arjun Reddy", email: "arjun.reddy@example.com", status: "Contacted", source: "Website" },
  { name: "Isha Banerjee", email: "isha.banerjee@example.com", status: "Qualified", source: "Referral" }
];

const seed = async (): Promise<void> => {
  await connectDb();

  await User.deleteMany({ email: { $in: ["admin@smartleads.dev", "sales@smartleads.dev"] } });
  await Lead.deleteMany({ email: { $in: sampleLeads.map((lead) => lead.email) } });

  const admin = await User.create({
    name: "Demo Admin",
    email: "admin@smartleads.dev",
    password: "Password123!",
    role: "admin"
  });

  await User.create({
    name: "Demo Sales",
    email: "sales@smartleads.dev",
    password: "Password123!",
    role: "sales"
  });

  await Lead.insertMany(sampleLeads.map((lead) => ({ ...lead, createdBy: admin._id })));

  console.log("Seed complete");
  console.log("Admin: admin@smartleads.dev / Password123!");
  console.log("Sales: sales@smartleads.dev / Password123!");
  await mongoose.disconnect();
};

void seed().catch(async (error) => {
  console.error("Seed failed", error);
  await mongoose.disconnect();
  process.exit(1);
});
