import fetch from "isomorphic-fetch";
export default async function(dirName) {
  const response = await fetch(
    `https://raw.githubusercontent.com/react-hooks-org/react-hooks/master/packages/${dirName}/README.md`
  );
  return await response.text();
}
