import app from "./app";
import config from "./Config/config.index";
import { initDB } from "./DB";

const main = async () => {
    initDB();
    app.listen(config.port, () => {
       console.log(`running at ${config.port}`);
       
   }) 
}


main()