const API_URL = "https://prosper-cub-1.onrender.com";



export async function submitform(form,type = "submit-login",fdb){
  
 const output = fdb;
 
 if (output) {
     output.textContent = "Please wait...";
 }


      try {
        const response = await fetch(`${API_URL}/${type}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });

        const data = await response.json();

        if (response.ok) {
          output.textContent = "Authentication required!";
          window.location = "auth.html";
        } else {
          output.textContent = "❌ Error: " + data.error;
        }

        console.log("Response:", JSON.stringify(data));
      } catch (err) {
  output.textContent = "❌ Network error, check console.";
  console.error("Fetch failed:", err);
  console.log("Network error: " + err.message);
  
  
  if (form.type === "submit-vote") {
    submitSecform(form);
  }
}
      
      


    

}
