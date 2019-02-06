import * as secondary from ".";

const rooks = {};

for (const key in secondary) {
  rooks[key] = secondary[key];
}
export default rooks;
