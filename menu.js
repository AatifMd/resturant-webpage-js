document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return; // Ensure to exit if there's no token
    }

    const menuItemsDiv = document.getElementById('menu-items');
    const editFormPopup = document.getElementById("edit-form-popup");
    let currentEditItemId = null;

    function fetchItems() {
        fetch('https://filter-and-sort.onrender.com/menu-items', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            menuItemsDiv.innerHTML = '';
            data.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.classList.add('menu-item');
                menuItem.innerHTML = `
                    <span>${item.title}</span>
                    <p>${item.description}</p>
                    <img src="${item.imageURL}" alt="${item.title}">
                    <p>Price: $${item.price}</p>
                    <p>Ratings: ${item.ratings}</p>
                    <button onclick="editItem(${item.id}, ${item.price}, ${item.ratings})">Edit</button>
                    <button onclick="deleteItem(${item.id})">Delete</button>
                `;
                menuItemsDiv.appendChild(menuItem);
            });
        })
        .catch(error => {
            console.log('Error fetching menu items:', error);
        });
    }

    fetchItems(); // Call fetchItems to load menu items
    
    window.deleteItem = function(id) {
        if (window.confirm('Are you sure you want to delete this item?')) {
            fetch(`https://filter-and-sort.onrender.com/menu-items/${id}`, {
                method: "DELETE", // Delete the item from menu list
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                fetchItems();
            })
            .catch((error) => {
                console.log("Error deleting item:", error);
            });
        }
    };

    document.getElementById("edit-form").addEventListener("submit", function(e) {
        e.preventDefault();

        const newPrice = document.getElementById("edit-price").value;
        const newRatings = document.getElementById("edit-ratings").value;

        fetch(`https://filter-and-sort.onrender.com/menu-items/${currentEditItemId}`, {
            method: "PATCH", // Used to edit or update the form
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ price: newPrice, ratings: newRatings }), // Edit the price and ratings of the item
        })
        .then((response) => response.json())
        .then((data) => {
            fetchItems();
            closeEditForm();
        })
        .catch((error) => {
            console.log("Error updating item:", error);
        });
    });

    window.editItem = function(id, price, ratings) { // Function to edit the price and ratings of the item
        currentEditItemId = id;
        document.getElementById("edit-price").value = price;
        document.getElementById("edit-ratings").value = ratings;
        editFormPopup.style.display = "block";
    };

    window.closeEditForm = function() { // Function to close the edit form
        editFormPopup.style.display = "none";
        currentEditItemId = null;
    };

    document.getElementById("logout-button").addEventListener("click", function() { // Function for log out
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });
});
