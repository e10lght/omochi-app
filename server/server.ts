import express, { Request, Response } from "express";
import path from "path";

const app = express();
const port = 3000;

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Hello, Express with TypeScript!" });
});

// Reactのビルドディレクトリを指定
app.use(express.static(path.join(__dirname, "../../client/build")));

// すべてのリクエストをReactにルーティング
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

app.listen(port, () => {
  console.log(path.join(__dirname, "../client/build", "index.html"));
  console.log(`Server is running at http://localhost:${port}`);
});
