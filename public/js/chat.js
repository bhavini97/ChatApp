const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
document.addEventListener('DOMContentLoaded',()=>{
  setInterval(() => fetchMessage(), 1000);
//fetchMessage();
})
function fetchMessage(){
axios.get('http://localhost:3000/chatRoom/chats',{
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
}).then(res=>{
    //console.log(res.data.chats);
    displayMessage(res.data.chats)
}).catch(err=>{
   console.error('something went wrong while diplaying user chats',err)
})
}
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

function displayMessage(message){
    message.forEach(element => {
const messageElement = document.createElement("div");
  messageElement.className = "message you";
  messageElement.textContent = `You: ${element.messages}`;

  chatBox.appendChild(messageElement);
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
    });
}
