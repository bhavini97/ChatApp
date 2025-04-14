document.addEventListener('DOMContentLoaded', () => {
    const signUpForm = document.getElementById('signUp');
    if (signUpForm) {
      signUpForm.addEventListener('submit', signUpDetails);
    }
  
    const loginForm = document.getElementById('login');
    if (loginForm) {
      loginForm.addEventListener('submit', loginDetails);
    }
  });
  

 function signUpDetails(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const passWord = event.target.password.value;
    console.log(name,email,phone,passWord)

    axios.post(`http://localhost:3000/auth/signUp`,{
        name : name,
        email:email,
        phone:phone,
        password:passWord
    })
    .then(res=>{
      alert('Sign Up successfully')
      console.log(res.data)
      event.target.reset();
    }).catch(err=>{
        if (err.response) {
           alert(err.response.data.message); 
       } else {
           console.error(`Error in sending signup data`, err);
           alert('Something went wrong. Please try again.');
       }
  })
};

function loginDetails(event){
  event.preventDefault();
  const email = event.target.email.value;
  const passWord = event.target.password.value;
  
  axios.post('http://localhost:3000/auth/login',{
      email:email,
      password:passWord
  }).then(res=>{
     if(res.data.token){
        localStorage.setItem('token',res.data.token)
     }
     alert(res.data.message)
     event.target.reset();
     window.location.href ='/chatRoom'
  }).catch(err=>{
      alert(err.response.data.message)
      console.error('error while loggin in',err)
  })
};

document.getElementById("forgotPasswordLink").addEventListener("click", function(event) {
  event.preventDefault();
  document.getElementById("forgotContainer").style.display = "block";
});


// forgrt password
document.getElementById("forgotPasswordLink").addEventListener("click", function(event) {
  event.preventDefault();
  document.getElementById("forgotContainer").style.display = "block";
});
function submitForgotPassword(){
  const email = document.getElementById("email1").value;
  const messageBox = document.getElementById("responseMessage");

  if (!email) {
      messageBox.style.color = "red";
      messageBox.innerText = "Please enter your email!";
      return;
  }

  axios.post("http://localhost:3000/auth/password/forgotpassword", { email })
      .then(response => {
          messageBox.style.color = "green";
          messageBox.innerText = response.data.message || "Email sent! Check your inbox.";
      })
      .catch(error => {
          messageBox.style.color = "red";
          messageBox.style.fontWeight ="1000"
          messageBox.innerText = error.response?.data?.message || "Something went wrong!";
      });

}