const fetch = require("isomorphic-fetch");
const url = require("url");

const SECONDS_IN_AN_HOUR = 1 * 60 * 60;

module.exports = async (req, res) => {
  try {
    const { query } = url.parse(req.url, true);
    const { dirName } = query;
    if (!dirName) {
      throw new Error("required 'dirName' query");
    }
    let response = await fetch(
      `https://raw.githubusercontent.com/react-hooks-org/rooks/master/packages/${dirName}/README.md`
    );
    if (!response.ok) {
      response = await fetch(
        `https://raw.githubusercontent.com/react-hooks-org/rooks/master/packages/${dirName}/readme.md`
      );
    }
    const data = await response.text();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", `max-age=${SECONDS_IN_AN_HOUR} public`);
    res.statusCode = 200;
    res.end(JSON.stringify(data));
  } catch (err) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.statusCode = 500;
    res.end("Error occurred. " + err.message);
  }
};
