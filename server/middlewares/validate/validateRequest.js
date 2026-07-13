const mongoose = require("mongoose");
const validator = require("validator");
const ErrorHandler = require("../../utils/errorHandler");
const { runRemoteValidator } = require("./validator");

const getValue = (source, key) => {
  if (!key.includes(".")) {
    return source[key];
  }

  return key.split(".").reduce((acc, part) => {
    if (acc == null) return undefined;
    return acc[part];
  }, source);
};

const rules = {
  required(value, label = "Field") {
    if (value === undefined || value === null || value === "") {
      return `${label} is required`;
    }
    return null;
  },
  email(value, label = "Email") {
    if (value == null || value === "") return null;
    if (!validator.isEmail(String(value))) {
      return `${label} must be a valid email address`;
    }
    return null;
  },
  minLength(value, min, label = "Field") {
    if (value == null || value === "") return null;
    if (String(value).length < min) {
      return `${label} must be at least ${min} characters`;
    }
    return null;
  },
  maxLength(value, max, label = "Field") {
    if (value == null || value === "") return null;
    if (String(value).length > max) {
      return `${label} must be at most ${max} characters`;
    }
    return null;
  },
  isNumber(value, label = "Field") {
    if (value == null || value === "") return null;
    if (Number.isNaN(Number(value))) {
      return `${label} must be a number`;
    }
    return null;
  },
  min(value, min, label = "Field") {
    if (value == null || value === "") return null;
    if (Number(value) < min) {
      return `${label} must be at least ${min}`;
    }
    return null;
  },
  max(value, max, label = "Field") {
    if (value == null || value === "") return null;
    if (Number(value) > max) {
      return `${label} must be at most ${max}`;
    }
    return null;
  },
  oneOf(value, allowed, label = "Field") {
    if (value == null || value === "") return null;
    if (!allowed.includes(value)) {
      return `${label} must be one of: ${allowed.join(", ")}`;
    }
    return null;
  },
  objectId(value, label = "ID") {
    if (value == null || value === "") return null;
    if (!mongoose.Types.ObjectId.isValid(String(value))) {
      return `${label} is not a valid identifier`;
    }
    return null;
  },
  arrayMin(value, min, label = "Field") {
    if (!Array.isArray(value)) {
      return `${label} must be an array`;
    }
    if (value.length < min) {
      return `${label} must contain at least ${min} item(s)`;
    }
    return null;
  },
  matches(value, pattern, message) {
    if (value == null || value === "") return null;
    if (!pattern.test(String(value))) {
      return message;
    }
    return null;
  },
};

const runFieldRules = async (value, fieldRules, label, data) => {
  for (const rule of fieldRules) {
    let message = null;

    if (typeof rule === "function") {
      message = await rule(value, data);
    } else if (rule === "required") {
      message = rules.required(value, label);
    } else if (rule === "email") {
      message = rules.email(value, label);
    } else if (rule.type === "minLength") {
      message = rules.minLength(value, rule.value, label);
    } else if (rule.type === "maxLength") {
      message = rules.maxLength(value, rule.value, label);
    } else if (rule.type === "isNumber") {
      message = rules.isNumber(value, label);
    } else if (rule.type === "min") {
      message = rules.min(value, rule.value, label);
    } else if (rule.type === "max") {
      message = rules.max(value, rule.value, label);
    } else if (rule.type === "oneOf") {
      message = rules.oneOf(value, rule.value, label);
    } else if (rule.type === "objectId") {
      message = rules.objectId(value, label);
    } else if (rule.type === "arrayMin") {
      message = rules.arrayMin(value, rule.value, label);
    } else if (rule.type === "matches") {
      message = rules.matches(value, rule.pattern, rule.message);
    } else if (rule.type === "remote") {
      message = await runRemoteValidator(rule.url, value, data, label, rule.options, rules);
    }

    if (message) {
      return message;
    }
  }

  return null;
};

const validateRequest = (schema) => async (req, res, next) => {
  const errors = [];

  for (const [location, fields] of Object.entries(schema)) {
    const source =
      location === "body"
        ? req.body
        : location === "params"
          ? req.params
          : location === "query"
            ? req.query
            : req[location] || {};

    for (const [field, fieldRules] of Object.entries(fields)) {
      const label = fieldRules.label || field;
      const ruleList = fieldRules.rules || fieldRules;
      const value = getValue(source, field);
      const message = await runFieldRules(value, ruleList, label, source);

      if (message) {
        errors.push(message);
      }
    }
  }

  if (errors.length) {
    return next(new ErrorHandler(errors[0], 400));
  }

  return next();
};

module.exports = {
  validateRequest,
  rules,
};
