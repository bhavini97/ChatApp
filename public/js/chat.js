const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);

function sendMessage() {
  const message = input.value.trim();
  if (message === "") return;

  const messageElement = document.createElement("div");
  messageElement.className = "message you";
  messageElement.textContent = `You: ${message}`;

  chatBox.appendChild(messageElement);
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}
