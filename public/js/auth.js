
document.addEventListener('DOMContentLoaded',()=>{
    const signUpForm = document.getElementById('signUp');
    signUpForm.addEventListener('submit',(event)=>signUpDetails(event));
})
async function signUpDetails(event) {
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
}