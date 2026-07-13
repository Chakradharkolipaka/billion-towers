const { validateRequest } = require("./validateRequest");

const PAGE_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

exports.validatePageKeyParam = validateRequest({
  params: {
    key: {
      label: "Page key",
      rules: [
        "required",
        {
          type: "matches",
          pattern: PAGE_KEY_PATTERN,
          message: "Page key must be lowercase letters, numbers, and hyphens only",
        },
      ],
    },
  },
});
