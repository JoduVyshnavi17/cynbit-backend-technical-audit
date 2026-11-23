const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { z } = require("zod");
const db = require("./db");

const app = express();

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

const inquirySchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    company: z.string().trim().max(100).optional(),
    message: z.string().trim().min(10).max(1000)
}).strict();

const inquiryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Cynbit Backend Audit API is running!"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "Healthy",
        service: "Cynbit Backend Audit"
    });
});

app.post("/api/v1/inquiries", inquiryLimiter, (req, res) => {
    const result = inquirySchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: result.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message
            }))
        });
    }

    try {
        const { name, email, company, message } = result.data;

        const insert = db.prepare(`
            INSERT INTO inquiries (name, email, company, message)
            VALUES (?, ?, ?, ?)
        `);

        const inquiry = insert.run(
            name,
            email,
            company || null,
            message
        );

        return res.status(201).json({
            success: true,
            message: "Inquiry submitted successfully",
            data: {
                id: Number(inquiry.lastInsertRowid),
                status: "received"
            }
        });
    } catch (error) {
        console.error("Database error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to save inquiry"
        });
    }
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body"
        });
    }

    console.error("Unexpected server error:", err.message);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

module.exports = app;