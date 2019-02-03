const fetch = require("isomorphic-fetch");

const SECONDS_IN_AN_HOUR = 1 * 60 * 60;

const IGNORE_PACKAGES = ["website", "eslint-config", "rooks"];

module.exports = async (req, res) => {
  try {
    const response = await fetch(
      "https://api.github.com/repos/imbhargav5/rooks/contents/packages"
    );
    const data = await response.json();
    const validPackages = data.filter(
      package => !IGNORE_PACKAGES.includes(package.name)
    );
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", `max-age=${SECONDS_IN_AN_HOUR} public`);
    res.statusCode = 200;
    res.end(JSON.stringify(validPackages));
  } catch (err) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.statusCode = 500;
    res.end("Error occurred. " + err.message);
  }
};
