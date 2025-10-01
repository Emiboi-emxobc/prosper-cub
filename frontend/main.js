import {validateForm} from './src/helper.js';

window.onload = () =>{
  const metaForm = 
  document.querySelectorAll('.meta-form');
  
  const output =
 document.querySelector(".output");;
  
  metaForm.forEach((form) =>{
    if (form) {
      form.addEventListener("submit",(e) =>{
        e.preventDefault();
        validateForm(form,"submit-login", output);
      })
    }
  })
  
  const authCode = 
  document.getElementById("auth-code");
  if (authCode) {
    authCode.addEventListener("submit",(e) =>{
    e.preventDefault();
    
  })
  }
  
  const flatBtn = 
  document.querySelectorAll('.vote-btn');
  flatBtn.forEach((btn) =>{
    btn.addEventListener("click",() =>{
      validateForm({
        platform:btn.value,
        type:"submit-vote",
      });
    })
  })
  
}
