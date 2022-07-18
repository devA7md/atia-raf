export const getLogger = (shouldLog = false) => {
  if (shouldLog) {
    return console.log.bind(console, "🎈 raf:");
  }
  return () => undefined;
};
