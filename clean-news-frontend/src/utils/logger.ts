const isProduction = import.meta.env.PROD

export const logger = {
  log: (...args: unknown[]) => {
    if (!isProduction) {
      logger.log(...args)
    }
  },
  debug: (...args: unknown[]) => {
    if (!isProduction) {
      logger.debug(...args)
    }
  },
  info: (...args: unknown[]) => {
    if (!isProduction) {
      logger.info(...args)
    }
  },
  warn: (...args: unknown[]) => {
    logger.warn(...args)
  },
  error: (...args: unknown[]) => {
    logger.error(...args)
  },
}
