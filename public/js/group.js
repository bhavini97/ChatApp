function addNewMember() {
    const membersDiv = document.getElementById('members');
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'name';
    newInput.placeholder = 'Enter member mobile number';
    membersDiv.appendChild(newInput);
  }

  function addGroup() {
    const groupName = document.getElementById('groupName').value.trim();
    const names = Array.from(document.getElementsByClassName('name')).map(el => el.value.trim()).filter(Boolean);

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
      body: JSON.stringify({ groupName, members: names })
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById('message').textContent = data.message || 'Group created successfully!';
      setTimeout(() => {
        window.location.href = '/chatRoom/';
      }, 1000);
    })
    .catch(err => {

      alert(err.message)
      document.getElementById('message').textContent = err.message;
      console.error(err);
    });
  }