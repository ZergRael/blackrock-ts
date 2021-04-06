import log from "./logger";
import fs from "fs";
import readline from "readline";
import { PerformanceObserver, performance } from "perf_hooks";
import { LogEvent, SpellLogEvent } from "./log-event";
import logEvents from "./log-events";

const obs = new PerformanceObserver((list, observer) => {
  log.debug(list.getEntries()[0]);
  performance.clearMarks();
  observer.disconnect();
});
obs.observe({ entryTypes: ["measure"], buffered: true });

const trackedCasts = {
  "17540": true, // Stoneshield
  "11405": true, // Giants
  "17538": true, // Mongoose
  "11334": true, // Agility
  "17038": true, // Firewater
  "26276": true, // Firepower
  "11474": true, // Shadowpower
  "17539": true, // Greater Arcane
  "11390": true, // Arcane
  "25122": true, // Brilliant Wizard Oil
  // "24363": true, // Mageblood -- Does not work ?
  "25123": true, // Brilliant Mana Oil
  "17548": true, // GSP
  "18610": true, // HRB
  "17544": true, // GFP
};
const trackedAuras = {
  "18194": true, // Food MP5
};

const buffsCounter = {};

async function run(filepath) {
  performance.mark("start");

  const rl = readline.createInterface({
    input: fs.createReadStream(filepath),
    output: process.stdout,
    terminal: false,
  });

  let lineCount = 0;
  rl.on("line", (line) => {
    ++lineCount;
    parseLine(line);
  });

  rl.on("close", () => {
    performance.mark("end");
    console.log(buffsCounter);
    log.info(`Parsed ${lineCount} lines`);
    performance.measure("end", "start", "end");
  });
}

async function parseLine(line) {
  const le = LogEvent.new(line);

  if (le instanceof SpellLogEvent) {
    if (le.event == logEvents.SPELL_CAST_SUCCESS) {
      if (le.spellId in trackedCasts) {
        const name = le.name;
        const spellId = le.spellId;

        if (!(name in buffsCounter)) {
          buffsCounter[name] = {};
        }
        if (!(spellId in buffsCounter[name])) {
          buffsCounter[name][spellId] = 0;
        }

        ++buffsCounter[name][spellId];
      }
    }

    if (le.event == logEvents.SPELL_AURA_APPLIED) {
      if (le.spellId in trackedAuras) {
        const name = le.name;
        const spellId = le.spellId;

        if (!(name in buffsCounter)) {
          buffsCounter[name] = {};
        }
        if (!(spellId in buffsCounter[name])) {
          buffsCounter[name][spellId] = 0;
        }

        ++buffsCounter[name][spellId];
      }
    }
  }
}

export default { run };
