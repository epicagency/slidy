module.exports = {
  "src/**/*.ts": ["prettier --write", "yarn lint"],
  "*.{json,md}": ["prettier --write"]
}
