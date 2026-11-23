
const request = require("supertest");
const app = require("../src/app");

describe("Cynbit Inquiry API Tests", () => {

    test("GET /health should return healthy status", async () => {
        const response = await request(app).get("/health");

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("Healthy");
    });

    test("POST should accept valid inquiry", async () => {
        const response = await request(app)
            .post("/api/v1/inquiries")
            .send({
                name: "Vyshnavi",
                email: "vyshnavi@example.com",
                message: "Testing the inquiry API successfully."
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
    });

    test("POST should reject invalid email", async () => {
        const response = await request(app)
            .post("/api/v1/inquiries")
            .send({
                name: "Vyshnavi",
                email: "invalid-email",
                message: "Testing invalid email validation."
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test("Unknown route should return 404", async () => {
        const response = await request(app).get("/unknown");

        expect(response.status).toBe(404);
    });

});
