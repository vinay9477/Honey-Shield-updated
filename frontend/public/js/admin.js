function logout() {
  localStorage.clear();
  window.location.href = "admin-login.html";
}

fetch("http://localhost:3000/api/admin/users")
  .then(res => res.json())
  .then(data => {
    document.getElementById("totalUsers").innerText = data.length;

    let bot = 0, honey = 0;
    data.forEach(u => {
      if (u.service === "bot") bot++;
      else honey++;

      users.innerHTML += `
        <tr>
          <td>${u.email}</td>
          <td>${u.organization || "N/A"}</td>
          <td>${u.service}</td>
        </tr>
      `;
    });

    document.getElementById("botCount").innerText = bot;
    document.getElementById("honeypotCount").innerText = honey;
  });
