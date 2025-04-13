const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");


document.addEventListener('DOMContentLoaded',()=>{
  //setInterval(() => fetchMessage(), 1000);  
  fetchUserGroups();
})

function fetchUserGroups() {
  axios.get('http://localhost:3000/groups/user-groups', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(response => {
    const groups = response.data.groups || [];
    if(groups.length==0){
      localStorage.removeItem('currentGroupId');
      localStorage.removeItem('chats')
    }
    console.log(groups)
    const groupList = document.getElementById("groupList");
    groupList.innerHTML = ""; // clear old

    groups.forEach(group => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center group-item";
      
      // Group name
      const span = document.createElement("span");
      span.textContent = group.groupName;
      span.style.cursor = "pointer";
      span.onclick = () => switchToGroup(group.id);
    
      // Action tab (info button)
      const actionBtn = document.createElement("button");
      actionBtn.className = "btn btn-sm btn-outline-primary";
      actionBtn.textContent = "i";
      actionBtn.style.font="italic"
      actionBtn.onclick = (e) => {
        e.stopPropagation(); // Prevent switching group when clicking this
        window.location.href = `/groups/${group.id}`; 
      };
    
      li.appendChild(span);
      li.appendChild(actionBtn);
      groupList.appendChild(li);
    });
    
  })
  .catch(error => {
    console.error("Failed to load user groups", error);
  });
}


function switchToGroup(groupId) {
  if(localStorage.getItem('chats')){
    localStorage.removeItem('chats');
  }
  localStorage.setItem("currentGroupId", groupId); // Save selected group

  fetchMessage(groupId); // reload messages for that group
}



function fetchMessage(groupId){
  
  //getting chat from local storage
  const cachedChats = JSON.parse(localStorage.getItem('chats')) || []; 
  // taking the last id of the chat
  const lastChatId = cachedChats.length ? cachedChats[cachedChats.length - 1].id : 0;
  if (!groupId) {
    console.warn("No group selected.");
    return;
  }
  
  axios.get(`http://localhost:3000/chatRoom/chats?after=${lastChatId}&groupId=${groupId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }).then(res=>{
    //console.log(res.data.chats);
    const newChats = res.data.chats || [];

    // Update localStorage with new messages
    const updatedChats = [...cachedChats, ...newChats].slice(-10); // Keep only latest 10
    localStorage.setItem('chats', JSON.stringify(updatedChats));

    displayMessage(JSON.parse(localStorage.getItem("chats")));
}).catch(err=>{
   console.error('something went wrong while diplaying user chats',err)
})
}

sendBtn.addEventListener("click", sendMessage);


function sendMessage() {
  const message = input.value.trim();
  if (!message || !localStorage.getItem('currentGroupId')) {
    alert('You are not part of any group')
    return;
  }
   const groupId = parseInt(localStorage.getItem('currentGroupId')) 

  axios.post(`http://localhost:3000/chatRoom?groupId=${groupId}`,
    { message: message },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  ).then(res=>{
      console.log(res.data.message)
      fetchMessage(parseInt(localStorage.getItem("currentGroupId")))
  }).catch(err=>{
      console.error(err.response.data.message)
  })
}

function displayMessage(message){
  chatBox.innerHTML=``;
    message.forEach(element => {
const messageElement = document.createElement("div");
  messageElement.className = "message you";
  messageElement.textContent = `${element.username}: ${element.messages}`;

  chatBox.appendChild(messageElement);
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
    });
}

document.getElementById('newGroupBtn').addEventListener('click',()=>{
  window.location.href = '/groups/add-group';
})

