function addNewMember() {
    const membersDiv = document.getElementById('members');
    const newInput = document.createElement('input');
    newInput.type = 'tel';
    newInput.className = 'phone';
    newInput.placeholder = 'Enter member mobile number';
    membersDiv.appendChild(newInput);
  }

  function addGroup() {
    const groupName = document.getElementById('groupName').value.trim();
    const phones = Array.from(document.getElementsByClassName('phone')).map(el => el.value.trim()).filter(Boolean);

    if (!groupName) {
      document.getElementById('message').textContent = "Group name is required!";
      return;
    }

    // Send to server
    fetch('/groups/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ groupName, members: phones })
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById('message').textContent = data.message || 'Group created successfully!';
      window.location.href = '/chatRoom/'; 
    })
    .catch(err => {
      document.getElementById('message').textContent = 'Failed to create group!';
      console.error(err);
    });
  }