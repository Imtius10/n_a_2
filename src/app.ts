import express, { type Request, type Response } from "express"
import { router } from "./API/Routes/user.route";
import { IssueRoute } from "./API/Routes/issue.routes";
import cookieparser from "cookie-parser"
const app = express();
app.use(express.json())
app.use(cookieparser())
// app.get("/", (req: Request, res: Response) => {
//     res.send("Hello from testing");
// })
app.use("/api", router)
app.use("/api",IssueRoute)

export default app;