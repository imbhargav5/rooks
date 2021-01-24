---
id: use-fullscreen
title: use-fullscreen
sidebar_label: use-fullscreen
---

    

## About

Use full screen api for making beautiful and emersive experinces.

## Installation

    npm install --save @rooks/use-fullscreen

## Importing the hook

```javascript
import useFullscreen from "@rooks/use-fullscreen"
```

## Usage

### TIP: Notice that with SSR projects (i.e. Next.js) the hook will return undefined on initial load (FullScreen API is a browser-only API). Only when a browser it detected, it will return the actual hook functionality. That's why, we are doing the check for it.

```jsx
import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { useFullscreen } from "rooks";

const styles = {
  html: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    padding: "30px 10px 0 0",
    fontSize: "20px",
    lineHeight: "1.4",
    color: "#737373",
    background: "#f0f0f0",
    WebkitFontSmoothing: "antialiased"
  },
  hr: {
    border: "none",
    borderTop: "1px solid #e6e6e6",
    margin: "20px 0"
  },
  a: {
    color: "#666"
  },
  h1: {
    margin: "0",
    fontSize: "40px",
    textAlign: "center"
  },
  ul: {
    padding: "0 0 0 40px",
    margin: "1em 0",
    padding: "0",
    margin: "40px 0 0 0",
    listStyle: "none"
  },
  button: {
    fontSize: "13px"
  },
  container: {
    width: "500px",
    padding: "30px 20px",
    margin: "0 auto 50px auto",
    background: "#fcfcfc",
    textAlign: "center",
    border: "1px solid #b3b3b3",
    borderRadius: "4px",
    boxShadow: "0 1px 10px #a7a7a7, inset 0 1px 0 #fff"
  },
  demo_img: {
    cursor: "pointer"
  },
  header_p: {
    fontSize: "17px"
  }
};

function Demo() {
  const container = useRef();
  const fullscreen = useFullScreen();

  const [changeCount, setChangeCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  if(!fullscreen) {
    return null;
  }

  const {
    isEnabled,
    toggle,
    onChange,
    onError,
    request,
    exit,
    isFullscreen,
    element
  } = fullscreen;

  onChange(() => {
    setChangeCount(changeCount + 1);
  });
  onError(() => {
    setErrorCount(errorCount + 1);
  });

  return (
    <div id="document" style={styles.html}>
      <section ref={container} id="container" style={styles.container}>
        <header>
          <h1 styles={styles.h1}>useFullscreen</h1>
          <p style={styles.header_p}>
            Simple react hook for cross-browser usage of the JavaScript{" "}
            <a
              style={styles.a}
              href="https://developer.mozilla.org/en/DOM/Using_full-screen_mode"
            >
              Fullscreen API
            </a>
            , which lets you bring the page or any element into fullscreen.
            Smoothens out the browser implementation differences, so you don't
            have too.
          </p>
        </header>
        <hr style={styles.hr} />
        <section>
          <p>Try out the Fullscreen API</p>
          <button
            style={styles.button}
            onClick={() => {
              request(container.current);
            }}
          >
            Request
          </button>
          <button
            style={styles.button}
            onClick={() => {
              exit();
            }}
          >
            Exit
          </button>
          <button
            style={styles.button}
            onClick={() => {
              toggle();
            }}
          >
            Toggle
          </button>
          <button style={styles.button} onClick={() => request()}>
            Request document
          </button>
        </section>
        <section>
          <ul style={styles.ul}>
            <li id="supported">
              Supported/allowed: {JSON.stringify(isEnabled)}
            </li>
            <li id="status">Is fullscreen: {JSON.stringify(isFullscreen)}</li>
            <li>
              Changed {changeCount} {changeCount !== 1 ? "times" : "time"}
            </li>
            <li>
              {errorCount} {errorCount !== 1 ? "errors" : "error"}
            </li>
            <li id="element">
              Element:{" "}
              {element
                ? `${element.tagName.toLowerCase()} ${element.id}`
                : "null"}
            </li>
          </ul>
        </section>
        <input placeholder="Keyboard test" />
        <hr style={styles.hr} />
        <section>
          <p>Click the image to make it fullscreen</p>
          <img
            id="demo-img"
            src="https://sindresorhus.com/unicorn"
            width="500"
            style={styles.demo_img}
            onClick={e => {
              toggle(e.target);
            }}
          />
        </section>
      </section>
    </div>
  );
}


render(<Demo/>)
```


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    