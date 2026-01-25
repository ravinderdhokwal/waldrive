import "dotenv/config";
import app from "./app.js";
import { APP_NAME } from "./constants.js";

const PORT = process.env.PORT; 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.send(`<h2>${APP_NAME} API Services</h2>`);
});