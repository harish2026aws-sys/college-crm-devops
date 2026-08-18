const express = require("express");
const mysql = require("mysql2/promise");
const { createClient } = require("redis");
require("dotenv").config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// MySQL connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Redis client
const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.on("error", (err) => {
    console.error("Redis Error:", err.message);
});

// Home endpoint
app.get("/", (req, res) => {
    res.json({
        application: "College CRM",
        status: "Running",
        environment: process.env.NODE_ENV || "development"
    });
});

// Health endpoint
app.get("/health", async (req, res) => {
    try {
        await db.query("SELECT 1");

        res.status(200).json({
            status: "UP",
            mysql: "UP"
        });
    } catch (error) {
        res.status(500).json({
            status: "DOWN",
            mysql: "DOWN"
        });
    }
});

// Student endpoint
app.get("/students", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM students ORDER BY id"
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            error: "Database error"
        });
    }
});

// Redis test endpoint
app.get("/cache-test", async (req, res) => {
    try {
        await redisClient.set("college", "College CRM");

        const value = await redisClient.get("college");

        res.status(200).json({
            redis: value
        });
    } catch (error) {
        console.error("Redis error:", error.message);

        res.status(500).json({
            error: "Redis error"
        });
    }
});

// Start application
async function startApplication() {
    try {
        await db.query("SELECT 1");
        console.log("MySQL connected");

        await redisClient.connect();
        console.log("Redis connected");

        app.listen(PORT, () => {
            console.log(`College CRM running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Application startup failed:", error.message);
        process.exit(1);
    }
}

startApplication();
