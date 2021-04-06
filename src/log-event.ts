import logEvents from "./log-events";

class LogEvent {
  timestamp: string;
  event: string;

  constructor(timestamp, event) {
    this.timestamp = timestamp;
    this.event = event;
  }

  static new(line: string): LogEvent {
    const [timestamp, contents] = line.split("  ");
    const [event, ...rest] = contents.split(",");

    switch (event) {
      case logEvents.SPELL_AURA_APPLIED:
      case logEvents.SPELL_CAST_SUCCESS:
        return new SpellLogEvent(timestamp, event, rest);
      default:
        return new LogEvent(timestamp, event);
    }
  }
}

class BaseLogEvent extends LogEvent {
  guid: string;
  name: string;
  flags: string;
  raidFlags: string;

  constructor(timestamp: string, event: string, details: string[]) {
    super(timestamp, event);

    this.guid = details.shift();
    this.name = details.shift();
    this.flags = details.shift();
    this.raidFlags = details.shift();
  }
}

class SpellLogEvent extends BaseLogEvent {
  targetGuid: string;
  targetName: string;
  targetFlags: string;
  targetRaidFlags: string;
  spellId: string;
  spellName: string;
  spellSchool: string;

  constructor(timestamp: string, event: string, details: string[]) {
    super(timestamp, event, details);

    this.targetGuid = details.shift();
    this.targetName = details.shift();
    this.targetFlags = details.shift();
    this.targetRaidFlags = details.shift();
    this.spellId = details.shift();
    this.spellName = details.shift();
    this.spellSchool = details.shift();
  }
}

export { LogEvent, SpellLogEvent };
