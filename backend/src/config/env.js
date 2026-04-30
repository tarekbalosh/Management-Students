/**
 * Validates required environment variables at startup.
 * Throws immediately if any are missing so the process won't start
 * in a broken state.
 */
const REQUIRED_VARS = [
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

const validateEnv = () => {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`❌  Missing required env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
};

module.exports = { validateEnv };
