import fetch from "isomorphic-fetch";
module.exports = async (req, res) => {
  const response = await fetch(
    "https://api.github.com/repos/react-hooks-org/rooks/contents/packages"
  );
  res.json(await response.json());
};
