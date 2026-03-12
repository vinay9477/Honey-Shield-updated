function logout() {
  localStorage.clear();
  window.location.href = "admin-login.html";
}

const usersTable = document.getElementById("usersTable");
const statUsers = document.getElementById("statUsers");

fetch("http://localhost:3000/api/admin/users")
  .then(res => res.json())
  .then(data => {

    statUsers.innerText = data.length;

    let bot = 0;
    let honey = 0;

    data.forEach(u => {

      if (u.service === "bot") bot++;
      else honey++;

      if (usersTable) {
        usersTable.innerHTML += `
        <tr>
          <td>${u.email}</td>
          <td>${u.organization || "N/A"}</td>
          <td>${u.service}</td>
        </tr>`;
      }

    });

  })
  .catch(err => {
    console.error("Admin fetch error:", err);
  });