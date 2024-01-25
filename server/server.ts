import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { expressjwt } from "express-jwt";
import express, { ErrorRequestHandler, Request } from "express";
import path from "path";
import "reflect-metadata";
import cors from "cors";
import { PORT, SECRET_KEY } from "./config/config";
import "./db/connect";
import router from "./routes/router";

const app = express();

// app.use((req: Request, res: Response, next: NextFunction) => {
//   const appurl = process.env.APP_URL || "";

//   if (process.env.NODE_ENV !== "dev") {
//     res.setHeader("Access-Control-Allow-Origin", appurl);
//   } else if (process.env.NODE_ENV === "dev") {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//   }

//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });

app.use(
  cors({
    origin: process.env.NODE_ENV === "dev" ? "*" : process.env.APP_URL,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  expressjwt({
    secret: SECRET_KEY,
    algorithms: ["HS256"],
    getToken: (req: Request) => {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        return req.headers.authorization.split(" ")[1];
      }
      return undefined;
    },
  }).unless({
    path: [
      { url: "/api/auth/login" },
      {
        url: /^\/(?!api\/).*/,
        methods: ["GET", "OPTIONS"],
      },
    ],
  })
);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send({ message: "認証されていません！" });
  } else {
    next(err);
  }
};
app.use(errorHandler);

app.use(express.json());

app.use("/api", router);

// Reactのビルドディレクトリを指定
app.use(express.static(path.join(__dirname, "../../client/build")));

// すべてのリクエストをReactにルーティング
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(path.join(__dirname, "../client/build", "index.html"));
  console.log(`Server is running at http://localhost:${PORT}`);
});
