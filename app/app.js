const socket = io("ws://localhost:8080", {
  extraHeaders: {
    "x-test-header": "This is the header value"
  }
});

// press button to submit answer
document.querySelector("button").onclick = () => {
  const text = document.querySelector("input").value;
  socket.emit("message", text);
  document.querySelector("input").value = "";
  const el = document.createElement("li");
  el.innerHTML = "You said: " + text;
  document.querySelector("ul").appendChild(el);
};

// press enter to submit answer
document.getElementById("message").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const text = document.querySelector("input").value;
    socket.emit("message", text);
    document.querySelector("input").value = "";
    // const el = document.createElement("li");
    // el.innerHTML = "You said: " + text;
    // document.querySelector("ul").appendChild(el)s;
  }
});

socket.on("message-server", (text) => {
  const el = document.createElement("li");
  el.innerHTML = text;
  document.querySelector("ul").appendChild(el);
});

socket.on("message", (text) => {
  const el = document.createElement("li");
  el.innerHTML = text;
  document.querySelector("ul").appendChild(el);
});


