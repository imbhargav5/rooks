self.postMessage(1);
setTimeout(() => {
  throw new Error(
    "Dummy error thrown from worker after 1 second. This will be catched."
  );
}, 1000);
