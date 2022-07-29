/* eslint-disable canonical/filename-match-exported */
/* eslint-disable import/namespace */
/* eslint-disable guard-for-in */
import * as secondary from ".";

const rooks: {
  [key: string]: unknown;
} = {};

for (const key in secondary) {
  rooks[key] = (
    secondary as {
      [key: string]: unknown;
    }
  )[key] as unknown;
}

export default rooks;
