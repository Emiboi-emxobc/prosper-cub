import {submitform} from './transport.js';

export function validateForm(form,type =form.type) {
  
  switch (type) {
    case 'submit-login':
      const username =
      form.username.value;
      const password =
      form.password.value;
      const cplatform =
      form.platform.value;
      
      const formData = 
      {username: username,
      password: password,
        type :type,
        platform: cplatform
      };
      
      if (!password || !username || !password.length > 6 || !username.length > 3) {
        
        output.textContent = "wrong credentials!";
        return;
      }
      submitform(formData);
      break;
     case 'submit-vote':
       
       submitform(form);
       break;
     
    default:
     alert(form)
  }
}

