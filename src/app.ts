import dotenv from "dotenv";
dotenv.config();
import log from "./logger";
import parser from "./parser";

async function run(args: String[]) {
  log.silly("Hello");

  if (args.length < 3) {
    log.error("Missing log filepath argument");
    return;
  }

  await parser.run(args[2]);

  log.silly("Bye");
}

run(process.argv);
