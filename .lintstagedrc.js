module.exports = {
  "src/**/*.ts": ["prettier --write","yarn run lint","git add"],
  "*.{json,md}": ["prettier --write","git add"]
}
