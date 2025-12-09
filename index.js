const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  // Show temporary "typing..."
  const loadingMsg = document.createElement("div");
  loadingMsg.classList.add("message", "ai");
  loadingMsg.textContent = "Typing...";
  chatBox.appendChild(loadingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    let responseText;

    // ✅ Check if Puter SDK is available
    if (typeof puter !== "undefined" && puter.ai && puter.ai.chat) {
      const response = await puter.ai.chat(message, { model: "gpt-5-nano" });
      responseText = response || "Hmm... I couldn’t generate a reply.";
    } else {
      // ⚠️ Fallback Dummy AI Response
      responseText =
        "Puter SDK not loaded 😢 — using fallback logic.\n\nHere’s a dummy reply: Exercise improves your health, mood, and energy!";
    }

    loadingMsg.textContent = responseText;
  } catch (error) {
    loadingMsg.textContent = "⚠️ Error fetching response: " + error.message;
  }
}

console.log("Script loaded — starting diagnostics.");

window.addEventListener("DOMContentLoaded", () => {
  if (typeof puter === "undefined") {
    console.error("❌ puter is undefined. SDK did not load.");
    alert("ERROR: Puter.js SDK did not load. Check console for details.");
    return;
  }

  console.log("✅ puter object found:", puter);

  // Try a simple API call
  puter.ai.chat("Hello, are you working?", { model: "gpt-5-nano" })
    .then(response => {
      console.log("Response from puter.ai.chat:", response);
      alert("✔️ SDK working! Response: " + response);
    })
    .catch(error => {
      console.error("❌ Error during puter.ai.chat:", error);
      alert("ERROR: puter.ai.chat failed. Check console for details.");
    });
});
