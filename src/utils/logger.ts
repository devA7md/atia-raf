import { Logger } from "../types";

export const getLogger = (shouldLog = false): Logger => {
  if (shouldLog) {
    return console.log.bind(console, "🎈 raf:");
  }
  return () => undefined;
};
