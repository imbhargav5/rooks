import fetch from "isomorphic-fetch";

export async function getNpmBlob() {
  const response = await fetch("https://react-hooks.org/api/search");
  const jsonResponse = await response.json();
  const { results } = jsonResponse;
  return results
    .filter(result => result.name[0].startsWith("@rooks/"))
    .map(r => {
      return {
        ...r,
        _name: r.name[0].slice(7)
      };
    });
}
