const express = require("express");
const path = require("path");
const app = express();

const cors = require("cors");
const PORT = 2025;

app.use(express.static(path.join(__dirname, "../public/")));
app.use("/Build", express.static(path.join(__dirname, "../public/Build"))); 
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, ".../public/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
