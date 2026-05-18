import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { auth } from "../lib/auth";
import { db } from "../lib/db";
import { user } from "../lib/schema";
import { eq } from "drizzle-orm";

// Check if this module is being run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

export async function seedAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = "Admin";

    if (!email || !password) {
        console.warn("Skipping admin seeding: ADMIN_EMAIL and ADMIN_PASSWORD environment variables not set.");
        return;
    }

    console.log(`Checking if admin user ${email} exists...`);

    const existingUser = await db.select().from(user).where(eq(user.email, email)).get();

    if (existingUser) {
        console.log("Admin user exists. Verifying password...");

        try {
            await auth.api.signInEmail({
                body: {
                    email,
                    password,
                }
            });
            console.log("Password verified. Admin credentials are correct.");

            if (existingUser.role !== "admin") {
                console.log("Updating role to admin...");
                await db.update(user).set({ role: "admin" }).where(eq(user.id, existingUser.id));
            }
        } catch (error) {
            console.log("Password mismatch or sign-in failed. Recreating admin user to update password...");

            // Delete existing user to recreate with new password
            await db.delete(user).where(eq(user.id, existingUser.id));

            await createAdminUser(email, password, name);
        }
    } else {
        console.log("Admin user does not exist. Creating...");
        await createAdminUser(email, password, name);
    }
}

async function createAdminUser(email: string, password: string, name: string) {
    try {
        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
            }
        });

        const newUser = await db.select().from(user).where(eq(user.email, email)).get();
        if (newUser) {
            await db.update(user).set({ role: "admin" }).where(eq(user.id, newUser.id));
            console.log("Admin user created successfully with role 'admin'.");
        } else {
            console.error("Failed to find created user.");
        }
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
}

if (isMainModule) {
    seedAdmin().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}

