import fetch from "isomorphic-fetch";
export default async function(dirName) {
  const response = await fetch(
    `https://react-hooks.org/api/readme?dirName=${dirName}`
  );
  return await response.text();
}
