
const token = localStorage.getItem("token");
const socket = io('http://localhost:3000', {
  query: { token }
});

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let previousGroupId = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchUserGroups();

  const currentGroupId = localStorage.getItem('currentGroupId');
  if (currentGroupId) {
    socket.emit('joinGroup', currentGroupId);
    fetchMessage(currentGroupId); // Load last 10 messages
  }
});

// HANDLE INCOMING SOCKET MESSAGE
socket.on('receiveMessage', (data) => {
  const currentGroupId = parseInt(localStorage.getItem('currentGroupId'));
  if (data.groupId !== currentGroupId) return;

  const chats = JSON.parse(localStorage.getItem('chats')) || [];
  const updatedChats = [...chats, data].slice(-10);
  localStorage.setItem('chats', JSON.stringify(updatedChats));

  displayMessage(updatedChats);
});

//  DISPLAY MESSAGES
function displayMessage(messages) {
  chatBox.innerHTML = '';
  messages.forEach(msg => {
    const messageElement = document.createElement("div");
    messageElement.className = "message you";
    messageElement.textContent = `${msg.username}: ${msg.messages}`;
    chatBox.appendChild(messageElement);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

//  FETCH LAST 10 MESSAGES FOR GROUP
function fetchMessage(groupId) {
  const cachedChats = JSON.parse(localStorage.getItem('chats')) || [];
  const lastChatId = cachedChats.length ? cachedChats[cachedChats.length - 1].id : 0;

  axios.get(`http://localhost:3000/chatRoom/chats?after=${lastChatId}&groupId=${groupId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }).then(res => {
    const newChats = res.data.chats || [];
    const updatedChats = [...cachedChats, ...newChats].slice(-10);
    localStorage.setItem('chats', JSON.stringify(updatedChats));
    displayMessage(updatedChats);
  }).catch(err => {
    console.error('Error fetching messages:', err);
  });
}

// SEND MESSAGE VIA SOCKET + API (store in DB, then broadcast)
sendBtn.addEventListener("click", () => {
  const message = input.value.trim();
  if (!message) return alert('Type a message');

  const groupId = parseInt(localStorage.getItem('currentGroupId'));
  if (!groupId) return alert('You are not part of any group');

  axios.post(`http://localhost:3000/chatRoom?groupId=${groupId}`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  ).then(() => {
    socket.emit('sendMessage', groupId, message);
    input.value = ""; // Clear input only here
  }).catch(err => {
    console.error('Send failed:', err);
  });
});

//  SWITCH TO A DIFFERENT GROUP
function switchToGroup(groupId) {
  if (previousGroupId && previousGroupId !== groupId) {
    socket.emit('leaveGroup', previousGroupId);
  }

  previousGroupId = groupId;
  localStorage.setItem("currentGroupId", groupId);
  localStorage.removeItem('chats');

  socket.emit('joinGroup', groupId);
  fetchMessage(groupId);
}

// LOAD USER GROUPS
function fetchUserGroups() {
  axios.get('http://localhost:3000/groups/user-groups', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(response => {
    const groups = response.data.groups || [];

    if (groups.length === 0) {
      localStorage.removeItem('currentGroupId');
      localStorage.removeItem('chats');
    }

    const groupList = document.getElementById("groupList");
    groupList.innerHTML = "";

    groups.forEach(group => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center group-item";

      const span = document.createElement("span");
      span.textContent = group.groupName;
      span.style.cursor = "pointer";
      span.onclick = () => switchToGroup(group.id);

      const actionBtn = document.createElement("button");
      actionBtn.className = "btn btn-sm btn-outline-primary";
      actionBtn.textContent = "i";
      actionBtn.onclick = (e) => {
        e.stopPropagation();
        window.location.href = `/groups/${group.id}`;
      };

      li.appendChild(span);
      li.appendChild(actionBtn);
      groupList.appendChild(li);
    });
  }).catch(error => {
    console.error("Failed to load groups", error);
  });
}

document.getElementById('newGroupBtn').addEventListener('click', () => {
  window.location.href = '/groups/add-group';
});
