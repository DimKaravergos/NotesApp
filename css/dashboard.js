document.addEventListener("DOMContentLoaded", function () {
  const username = sessionStorage.getItem("username");
  if (!username) {
    window.location.href = "/";
    return;
  }
  document.getElementById("usernameDisplay").textContent = username;

  document
    .getElementById("logoutButton")
    .addEventListener("click", function () {
      sessionStorage.removeItem("username");
      window.location.href = "/";
    });

  document
    .getElementById("addNoteButton")
    .addEventListener("click", async function () {
      const noteContent = document.getElementById("noteContent").value;
      if (noteContent.trim() === "") {
        alert("Note content cannot be empty.");
        return;
      }

      try {
        const response = await fetch("/addNote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, note: noteContent }),
        });

        const result = await response.json();
        if (result.success) {
          document.getElementById("noteContent").value = "";
          loadNotes();
        } else {
          alert("Failed to add note.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });

  async function loadNotes() {
    try {
      const response = await fetch(`/getNotes?username=${username}`);
      const result = await response.json();
      if (result.success) {
        const notesList = document.getElementById("notesList");
        notesList.innerHTML = "";
        result.notes.forEach((note) => {
          const li = document.createElement("li");
          li.textContent = note;

          // Create delete icon (X)
          const div = document.createElement("div");
          div.classList.add("notesDiv");
          const deleteIcon = document.createElement("i");
          deleteIcon.style.color = "#4f3f8d";
          // <i class="fa-solid fa-trash" style="color: #4f3f8d;"></i>
          deleteIcon.classList.add("delete-icon");
          deleteIcon.classList.add("fa-solid");
          deleteIcon.classList.add("fa-trash");
          deleteIcon.addEventListener("click", () => {
            if (confirm("Delete note?")) {
              deleteNote(note);
            }
          });

          div.appendChild(li);
          div.appendChild(deleteIcon);
          notesList.appendChild(div);
        });
      } else {
        alert("Failed to load notes.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function deleteNote(note) {
    try {
      const response = await fetch("/deleteNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, note }),
      });

      const result = await response.json();
      if (result.success) {
        loadNotes();
      } else {
        alert("Failed to delete note.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  loadNotes();
});
