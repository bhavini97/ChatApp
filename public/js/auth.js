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
     window.location.href ='/auth/login'
  }).catch(err=>{
      alert(err.response.data.message)
      console.error('error while loggin in',err)
  })
};
