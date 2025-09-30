export function sendFeedback(props, callback) {
  const el = document.createElement("div");
  el.className = props.className || "";

  // Title / heading
  const tiEl = document.createElement(props.level || "h3");
  if (props.title) {
    tiEl.textContent = props.title;
    el.appendChild(tiEl);
  }

  // Description
  if (props.desc) {
    const p = document.createElement("p");
    p.textContent = props.desc;
    el.appendChild(p);
  }

  // Buttons
  if (Array.isArray(props.buttons)) {
    props.buttons.forEach((btn) => {
      const b = document.createElement("button");
      b.textContent = btn.text || "Click";
      b.className = btn.className || "";
      el.appendChild(b);

      b.onclick = () => {
        if (btn.onClick) {
          btn.onClick(el); // custom handler
        } else {
          el.remove(); // default behavior
        }
      };
    });
  }

  // Append to DOM
  document.body.appendChild(el);

  // Run callback
  if (callback) {
    callback(el);
  }
}