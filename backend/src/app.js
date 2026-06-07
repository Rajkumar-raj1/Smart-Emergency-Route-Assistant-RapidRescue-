import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "process.env.CORS_ORIGIN",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());


// routes import
import userRouter from "./routes/user.routes.js";
import emergencyRouter from "./routes/emergency.routes.js";
import routeRouter from "./routes/route.routes.js";
import sosRouter from "./routes/sos.routes.js";


import { errorHandler } from "./middlewares/error.middleware.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/emergency", emergencyRouter);
app.use("/api/v1/routes", routeRouter);
app.use("/api/v1/sos", sosRouter);

// health check
app.get("/", (req, res) => {
  res.send("Smart Emergency Route Assistant Backend Running");
});

app.use(errorHandler);




export { app };