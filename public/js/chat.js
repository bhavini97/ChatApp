const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
document.addEventListener('DOMContentLoaded',()=>{
  //setInterval(() => fetchMessage(), 1000);
  loadFromLocalStorage(); // Load cached messages
   fetchMessage();
   fetchUserGroups();
})
function loadFromLocalStorage() {
  const cachedChats = JSON.parse(localStorage.getItem('chats')) || [];
  displayMessage(cachedChats);
}
function fetchMessage(){
  //getting chat from local storage
  const cachedChats = JSON.parse(localStorage.getItem('chats')) || []; 
  // taking the last id of the chat
  const lastChatId = cachedChats.length ? cachedChats[cachedChats.length - 1].id : 0;
axios.get(`http://localhost:3000/chatRoom/chats?after=${lastChatId}`,{
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
}).then(res=>{
    //console.log(res.data.chats);
    const newChats = res.data.chats || [];

    // Update localStorage with new messages
    const updatedChats = [...cachedChats, ...newChats].slice(-10); // Keep only latest 10
    localStorage.setItem('chats', JSON.stringify(updatedChats));

    displayMessage(newChats);
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

document.getElementById('newGroupBtn').addEventListener('click',()=>{
  window.location.href = '/groups/add-group';
})

function fetchUserGroups() {
  axios.get('http://localhost:3000/groups/user-groups', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(response => {
    const groups = response.data.groups || [];
    console.log(groups)
    const groupList = document.getElementById("groupList");
    groupList.innerHTML = ""; // clear old

    groups.forEach(group => {
      const li = document.createElement("li");
      li.className = "list-group-item group-item";
      li.textContent = group.groupName;
      li.style.cursor = "pointer";
      li.onclick = () => switchToGroup(group.id);
      groupList.appendChild(li);
    });
  })
  .catch(error => {
    console.error("Failed to load user groups", error);
  });
}

function switchToGroup(groupId) {
  localStorage.setItem("currentGroupId", groupId); // Save selected group
  fetchMessage(); // reload messages for that group
}