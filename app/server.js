const express = require("express");
const mysql = require("mysql2/promise");
const { createClient } = require("redis");
require("dotenv").config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// MySQL connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Redis connection
const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});

async function connectServices() {
    try {
        await db.query("SELECT 1");
        console.log("MySQL connected");

        await redisClient.connect();
        console.log("Redis connected");
    } catch (error) {
        console.error("Service connection failed:", error.message);
    }
}

app.get("/", (req, res) => {
    res.json({
        application: "College CRM",
        status: "Running",
        environment: process.env.NODE_ENV || "development"
    });
});

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

app.get("/students", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM students");

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
});

app.get("/cache-test", async (req, res) => {
    try {
        await redisClient.set("college", "College CRM");

        const value = await redisClient.get("college");

        res.json({
            redis: value
        });
    } catch (error) {
        res.status(500).json({
            error: "Redis error"
        });
    }
});

connectServices();

app.listen(PORT, () => {
    console.log(`College CRM running on port ${PORT}`);
});
