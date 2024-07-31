document.addEventListener('DOMContentLoaded', function() {
    const menuItemsDiv = document.getElementById('menu-items');
    const sortSelect = document.getElementById("sort");
    const priceInput = document.getElementById("filter-price");
    const ratingInput = document.getElementById("filter-rating");
    const priceValue = document.getElementById("price-value");
    const ratingValue = document.getElementById("rating-value");
    const paginationControlsDiv = document.getElementById('pagination-controls');
    const itemsPerPage = 5; 
    let currentPage = 1;
    let totalItems = 0;
    let menuItems = [];
    let filteredItems = [];

    function fetchItems() {
        fetch('https://filter-and-sort.onrender.com/menu-items')
            .then(response => (response.json()))
            .then(data => {
                menuItems = data;
                totalItems = menuItems.length; // Get the total number of items to show on web pages
                updateDisplay();
            })
            .catch(error => {
                console.log('Error fetching menu items:', error);
                menuItemsDiv.innerHTML = '<p>Failed to load menu items. Please try again later.</p>';
            });
    }

    function displayItems(items) {            //display the items on the page
        menuItemsDiv.innerHTML = "";
        if (items.length === 0) {
            menuItemsDiv.innerHTML = "<p>No items to display</p>";
        } else {
            const startIndex = (currentPage - 1) * itemsPerPage;          //store starting index from where the items will display
            const endIndex = startIndex + itemsPerPage;                    //store last index of item to which the items will be displayed
            const itemsToDisplay = items.slice(startIndex, endIndex);       //make separate array for the range items

            itemsToDisplay.forEach(item => {        //sliced array will be displayed on the page
                const menuItem = document.createElement("div");
                menuItem.classList.add("menu-item");
                menuItem.innerHTML = `
                    <span>${item.title}</span>
                    <p>${item.description}</p>
                    <img src="${item.imageURL}" alt="${item.title}">
                    <p>Price: $${item.price}</p>
                    <p>Ratings: ${item.ratings}</p>
                    <button>Order</button>
                `;
                menuItemsDiv.appendChild(menuItem);
            });
        }

        paginationButtons();
    }

    function paginationButtons() {                                       
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage); //store the nymber of total pages to create
        paginationControlsDiv.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {   //creates the button according to total pages
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.disabled = (i === currentPage); // Disable current page button
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayItems(filteredItems);
            });
            paginationControlsDiv.appendChild(pageButton);
        }
    }

    function sortItems(items) {
        const sortValue = sortSelect.value;
        let sortedItems = [...items];      //spread operator stores the copy of array

        sortedItems.forEach(item => {
            item.price = parseFloat(item.price);
            item.ratings = parseFloat(item.ratings);
        });

        //sort the items 
        sortedItems.sort((a, b) => {
            switch (sortValue) {
                case "price-acs":
                    return a.price - b.price;
                case "price-decs":
                    return b.price - a.price;
                case "rating-acs":
                    return a.ratings - b.ratings;
                case "rating-decs":
                    return b.ratings - a.ratings;
                default:
                    return 0;
            }
        });
        console.log("Sorted Items: ", sortedItems); 
        return sortedItems;
    }

    sortSelect.addEventListener("change", updateDisplay);


    //filter the items
    function filterItems(items) {
        const maxPrice = parseFloat(priceInput.value) || 100;
        const minRating = parseFloat(ratingInput.value) || 0;

        filteredItems = items.filter(item => item.price <= maxPrice && item.ratings >= minRating);
        console.log("Filtered Items: ", filteredItems); 
        return filteredItems;
    }

    function updateDisplay() {
        let sortedItems = sortItems(menuItems);
        filteredItems = filterItems(sortedItems);
        displayItems(filteredItems);
    }


    priceInput.addEventListener("input", () => {
        priceValue.textContent = `0 - ${priceInput.value}`;
        updateDisplay();
    });

    ratingInput.addEventListener("input", () => {
        ratingValue.textContent = ratingInput.value;
        updateDisplay();
    });

    fetchItems(); // Load initial page
});
