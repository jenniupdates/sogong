const socket = io("ws://localhost:8080", {
  extraHeaders: {
    "x-test-header": "This is the header value"
  }
});

socket.on("message-server", (text) => {
  const el = document.createElement("li");
  el.innerHTML = text;
  document.querySelector("ul").appendChild(el);
});

document.querySelector("button").onclick = () => {
  const text = document.querySelector("input").value;
  socket.emit("message", text);
  document.querySelector("input").value = "";
};

