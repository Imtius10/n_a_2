import express, { type Request, type Response } from "express"
import { router } from "./API/Routes/route";

const app = express();
app.use(express.json())
app.get("/", (req: Request, res: Response) => {
    res.send("Hello from testing");
})
app.use("/",router)

export default app;