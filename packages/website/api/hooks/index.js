const { send } = require("micro");
const fetch = require("isomorphic-fetch");
module.exports = async (req, res) => {
  const response = await fetch(
    "https://api.github.com/repos/react-hooks-org/rooks/contents/packages"
  );
  const data = await response.json();
  send(res, 200, data);
};
