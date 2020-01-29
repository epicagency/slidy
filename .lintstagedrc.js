module.exports = {
  "**/*.ts": ["prettier --write", "yarn lint"],
  "*.{json,md}": ["prettier --write"]
}
