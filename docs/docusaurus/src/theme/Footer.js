import React from 'react';
import OriginalFooter from '@theme-original/Footer';
import { useEffect } from 'react';

export default function Footer(props) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3';
    script.async = true;
    script.defer = true;
    script.innerHTML = `
      new Crate({
        server: '768471216834478131', // Bhargav Ponnapalli
        channel: '775978916468752405' // #rooks
      })
    `;
    document.body.appendChild(script);
  }, []);
  return (
    <>
      <OriginalFooter {...props} />
      <script
        src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3"
        async
        defer
      ></script>
    </>
  );
}
