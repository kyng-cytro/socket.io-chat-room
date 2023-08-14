const socket = io();

const addNotifications = (action, user_id) => {
  const messageMarkup = `<div class="clearfix flex justify-center">
  <span class="text-xs py-3 text-slate-300">${user_id} just ${action} the chat</span>
</div>
`;

  const chatLayout = document.getElementById("chat-layout");

  chatLayout.innerHTML += messageMarkup;

  chatLayout.scrollTop = chatLayout.scrollHeight;
};

const addMessage = (message, user_id) => {
  let messageMarkup = "";
  console.log(user_id);
  if (message.id !== user_id) {
    messageMarkup = `
      <div class="clearfix">
        <div class="bg-slate-800 w-3/4 p-2 rounded-lg text-sm flex flex-col gap-1">
          <span class="font-semibold border-b border-slate-600 text-xs pb-1">
            ${message.id} - ${new Date(message.time).toLocaleTimeString(
      navigator.language,
      { hour: "2-digit", minute: "2-digit" }
    )}
          </span>
          <span>
            ${message.text}
          </span>
        </div>
      </div>
    `;
  } else {
    messageMarkup = `
      <div class="clearfix">
        <div class="bg-blue-600 float-right w-3/4 p-2 rounded-lg clearfix text-sm flex flex-col gap-1">
          <span class="font-semibold border-b border-blue-300 text-xs">
            You - ${new Date(message.time).toLocaleTimeString(
              navigator.language,
              { hour: "2-digit", minute: "2-digit" }
            )}
          </span>
          <span>
            ${message.text}
          </span>
        </div>
      </div>
    `;
  }
  const chatLayout = document.getElementById("chat-layout");

  chatLayout.innerHTML += messageMarkup;

  chatLayout.scrollTop = chatLayout.scrollHeight;
};

document.querySelector("#message").addEventListener("keypress", (e) => {
  if (e.keyCode === 13 && e.shiftKey) {
    // Prevent New Line
    e.preventDefault();

    // Grab Message
    const message = document.querySelector("#message").value;

    // Message Null Check
    if (!message) return;

    // Send Message
    socket.emit("message", message);

    // Reset Input
    document.querySelector("#message").value = "";
  }
});

socket.on("userCount", (userCount) => {
  count = userCount - 1;

  if (count < 1) {
    document.querySelector("#count").innerText = "No Other Active User(s)";
    document.querySelector("#dot").classList.add("bg-slate-600");
    document.querySelector("#dot").classList.remove("bg-green-600");
  } else {
    document.querySelector(
      "#count"
    ).innerText = `${count} Other Active User(s)`;
    document.querySelector("#dot").classList.remove("bg-slate-600");
    document.querySelector("#dot").classList.add("bg-green-600");
  }
});

socket.on("joined", (user_id) => {
  addNotifications("joined", user_id);
});

socket.on("left", (user_id) => {
  addNotifications("left", user_id);
});

socket.on("message", (message) => {
  addMessage(message, socket.id);
});

document.querySelector("#submit").addEventListener("click", () => {
  // Grab Message
  const message = document.querySelector("#message").value;

  // Message Null Check
  if (!message) return;

  // Send Message
  socket.emit("message", message);

  // Reset Input
  document.querySelector("#message").value = "";
});
