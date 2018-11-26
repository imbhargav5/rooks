//http://npmsearch.com/query?q=mouse%20rooks%20hooks%20react&fields=keywords,name,description,author,version
const fetch = require("isomorphic-fetch");
const url = require("url");

const SECONDS_IN_AN_HOUR = 1 * 60 * 60;

module.exports = async (req, res) => {
  try {
    const { query } = url.parse(req.url, true);
    const { q } = query;
    const response = await fetch(
      `http://npmsearch.com/query?q=${q}%20rooks%20hooks%20react&author=imbhargav5&fields=keywords,name,description,author,version&size=50`
    );
    const data = await response.json();
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
