const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { readdirSync } = require("fs");
require("dotenv").config();

//app
const app = express();
app.use(express.static(__dirname + "/uploads"));

//db
mongoose.connect(process.env.DATABASE).then(() => console.log("DB CONNECTED"))
.catch((err) => console.log("DB CONNECTION ERR", err));
//middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

// routes middleware
readdirSync("./src/v1/routes").map((r) =>app.use("/api/", require("./src/v1/routes/" + r)));

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
