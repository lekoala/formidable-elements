export default (value) => ["true", "false", "1", "0", true, false].includes(value) && !!JSON.parse(value);
