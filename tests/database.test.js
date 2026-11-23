const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db");

describe("SQLite Database Tests", () => {
    test("should save an inquiry permanently in the database", async () => {
        const response = await request(app)
            .post("/api/v1/inquiries")
            .send({
                name: "Database Test",
                email: "database-test@example.com",
                message: "Checking whether SQLite saves this inquiry."
            });

        expect(response.status).toBe(201);

        const savedInquiry = db.prepare(
            "SELECT * FROM inquiries WHERE id = ?"
        ).get(response.body.data.id);

        expect(savedInquiry).toBeDefined();
        expect(savedInquiry.name).toBe("Database Test");
        expect(savedInquiry.email).toBe("database-test@example.com");
        expect(savedInquiry.status).toBe("received");
    });
});