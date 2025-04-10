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

  axios.post('http://localhost:3000/chatRoom',
    { message: message },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  ).then(res=>{
      console.log(res.data.message)
  }).catch(err=>{
      console.error(err.response.data.message)
  })
}
