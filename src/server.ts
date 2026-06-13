import app from "./app";
import config from "./Config";
import { initDB } from "./DB";

const main = async () => {
  await initDB();
  app.listen(config.port);
};

main();
