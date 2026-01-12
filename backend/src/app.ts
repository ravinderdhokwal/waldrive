import express, { json, urlencoded } from "express";

const app = express();

app.use(json({ limit: "16kb" }));

app.use(urlencoded({ extended: true, limit: "16kb" }));

export default app;