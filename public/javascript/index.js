// Ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {

    // Main menu toggle
    const button2 = document.getElementById("mainmenu");
    const menu = document.getElementById("list");

    if (button2 && menu) {
        button2.addEventListener("click", function () {
            const isChecked = document.getElementById("checkbox").checked;
            menu.style.display = isChecked ? "block" : "none";
        });
    }

    // Function to toggle dropdown visibility (removed arrow-related code)
    function toggleDropdown(buttonId, dropdownId) {
        const dropdownButton = document.getElementById(buttonId);
        const dropdown = document.getElementById(dropdownId);

        // Ensure elements exist before attaching event listeners
        if (dropdownButton && dropdown) {
            dropdownButton.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent event bubbling

                // Toggle dropdown visibility
                dropdown.classList.toggle('hidden');
            });

            // Event listener on the document body to detect clicks outside the button
            document.body.addEventListener('click', function(event) {
                if (!dropdownButton.contains(event.target)) {
                    // Click outside dropdown button, close dropdown
                    dropdown.classList.add('hidden');
                }
            });
        } else {
            console.error("Dropdown elements not found:", buttonId, dropdownId);
        }
    }

    // Initialize for each dropdown button
    toggleDropdown('dropdownDefaultButton1', 'dropdown1');
    toggleDropdown('dropdownDefaultButton2', 'dropdown2');

    // Script for dropdown menu button in mobile screens
    const dropdownButton1 = document.getElementById('dropdownButton1');
    const dropdownContent = document.getElementById('dropdownContent');
    const element = document.getElementById('myElement');
    let isClicked = true;

    function toggleStyles() {
        if (!isClicked) {
            // Add styles when it's clicked
            element.style.top = '0';
            element.style.marginLeft = '50%';
            element.style.transform = 'translateX(-50%)';
            element.style.width = '0';
            element.style.transition = 'width 0.3s ease-in-out';
        } else {
            // Remove styles when clicked again
            element.style = '';
        }
        isClicked = !isClicked;
    }

    if (dropdownButton1 && dropdownContent) {
        dropdownButton1.addEventListener('click', toggleStyles);

        dropdownButton1.addEventListener('click', function () {
            dropdownContent.classList.toggle('hidden');
        });

        document.addEventListener('click', function (event) {
            if (!dropdownButton1.contains(event.target) && !dropdownContent.contains(event.target)) {
                dropdownContent.classList.add('hidden');
            }
        });
    } else {
        console.error("Dropdown button or content element not found!");
    }
});
