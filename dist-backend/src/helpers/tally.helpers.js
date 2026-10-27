import envConfig from "../config/envConfig.js";

/**
 * Returns the Tally endpoint URL.
 * Prefers TALLY_URL configured in .env, falling back to http://localhost:${port}.
 *
 * Supported formats for TALLY_URL:
 * - "http://localhost:9000"
 * - "http://192.168.1.50:9000"
 * - "http://192.168.1.50" (appends provided port)
 * - "192.168.1.50:9000" (prepends http://)
 *
 * @param {number|string} [port=9000] - Port number to use if URL does not specify one
 * @returns {string} Fully qualified Tally URL
 */
export const getTallyUrl = (port = 9000) => {
  const envUrl = envConfig.TALLY_URL || process.env.TALLY_URL;
  if (!envUrl || !envUrl.trim()) {
    return `http://localhost:${port || 9000}`;
  }

  let formatted = envUrl.trim();
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = `http://${formatted}`;
  }

  try {
    const parsed = new URL(formatted);
    if (!parsed.port && port) {
      parsed.port = String(port);
    }
    return parsed.origin;
  } catch {
    return formatted.replace(/\/+$/, "");
  }
};

export const getTallyTimeout = () => {
  return envConfig.TALLY_TIMEOUT ? Number(envConfig.TALLY_TIMEOUT) : 180000;
};

export default getTallyUrl;
