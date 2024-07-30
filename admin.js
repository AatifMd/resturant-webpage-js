document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "index.html";
    }
  
    const menuItemsDiv = document.getElementById("menu-items");
  
    function fetchItems() {
      fetch("https://filter-and-sort.onrender.com/menu-items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          menuItemsDiv.innerHTML = "";
          data.forEach((item) => {
            const menuItem = document.createElement("div");
            menuItem.classList.add("menu-item");
            menuItem.innerHTML = `
                  <span>${item.title}</span>
                  <p>${item.description}</p>
                  <img src="${item.imageURL}" alt="${item.title}" style="width: 100px;">
                  <p>Price: $${item.price}</p>
                  <p>Ratings: ${item.ratings}</p>
                  <button onClick="editItem(${item.id})">Edit</button>
                  <button onClick="deleteItem(${item.id})">Delete</button>
                  `;
            menuItemsDiv.appendChild(menuItem);
          });
        })
        .catch((error) => {
          console.log("Error fetching menu items:", error);
        });
    }
  
    document.getElementById("add-item-form").addEventListener("submit", function (e) {
      e.preventDefault();
  
      const newItem = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        imageURL: document.getElementById("imageURL").value,
        price: document.getElementById("price").value,
        ratings: document.getElementById("ratings").value,
      };
  
      fetch("https://filter-and-sort.onrender.com/menu-items", {
        method: "POST",                                        // send new item to server
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      })
        .then((response) => response.json())
        .then((data) => {
          fetchItems();
          document.getElementById("add-item-form").reset(); // Clear the form
        })
        .catch((error) => {
          console.log("Error adding new item:", error);
        });
    });
  
    fetchItems();
  });
  