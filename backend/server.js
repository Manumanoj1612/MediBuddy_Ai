require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const geminiRoute = require("./routes/gemini");
const doctorRouter = require("./routes/doctorRouter");
const profileRoute = require("./routes/profile");
const askRouter = require("./routes/askRouter");
const chatsRouter = require("./routes/chatsRouter");




connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", geminiRoute);
app.use("/api/auth", profileRoute);
app.use("/api/ask", askRouter);
app.use("/api/chats", chatsRouter);

app.use("/api/doctors", doctorRouter);


// Routes
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
