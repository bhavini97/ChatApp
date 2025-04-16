

const groupId = parseInt(localStorage.getItem('currentGroupId'))
    document.addEventListener("DOMContentLoaded", () => {
      fetchGroupMembers();
    });

    function fetchGroupMembers() {
      axios.get(`http://localhost:3000/groups/${groupId}/members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        if (res.data.message === "Group deleted because no users left") {
          alert("Group deleted. Redirecting to chat.");
          window.location.href = "/chat.html";
        }
        const { members, isAdmin } = res.data;
        
        if(!members){
          alert('group deleted')
          localStorage.removeItem('currentGroupId');
          localStorage.removeItem('chats');
          return;
        }
    
        const tbody = document.getElementById("membersTableBody");
        if (isAdmin) {
            document.getElementById('controls').style.display = 'block';
        } else {
            document.getElementById('controls').style.display = 'none';
            document.getElementById('adminCol').style.display = 'none';
        }
        
        tbody.innerHTML = "";
        members.forEach(member => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
            <td>${member.username}</td>
            <td>${member.email}</td>
            ${isAdmin ? `
              <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editUser(${member.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${member.id})">Delete</button>
              </td>` : ""}
          `;

          tbody.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Error fetching members", err);
      });
    }

    function editUser(userId) {
        if (confirm("Are you sure you want to make this member admin?")) {
            axios.put(`http://localhost:3000/groups/${groupId}/make-admin/${userId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              })
              .then(() => {
                alert("User promoted to admin");
        fetchGroupMembers()
    }).catch(err=>{
        console.log(err);
    })
}
}

async function deleteUser(userId) {
    if (!confirm("Are you sure you want to remove this member?")) return;
  
    try {
      await axios.delete(`http://localhost:3000/groups/${groupId}/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
  
      await fetchGroupMembers();
    } catch (err) {
      alert("Failed to delete member");
    }
  }
  
  function addNewMember() {
    const name = prompt("Enter name of the member to add:");
  
    if (!name) return;
  
    axios.post(`http://localhost:3000/groups/${groupId}/add-member`, { name }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(() => {
      alert("Member added successfully");
      fetchGroupMembers();
    })
    .catch(err => {
      alert(err.response?.data?.message || "Failed to add member");
    });
  }
  

    function goBack() {
      window.location.href = "/chat.html";
    }