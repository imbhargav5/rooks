import fetch from "isomorphic-fetch";
export default async function(dirName) {
  let response = await fetch(
    `https://raw.githubusercontent.com/react-hooks-org/rooks/master/packages/${dirName}/README.md`
  );
  if (!response.ok) {
    response = await fetch(
      `https://raw.githubusercontent.com/react-hooks-org/rooks/master/packages/${dirName}/readme.md`
    );
  }
  return await response.text();
}
