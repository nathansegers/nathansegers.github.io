
//#region "Show Cities"

// Step 1: Get elements
var toggle_pins_checkbox = document.querySelector("#toggle_pins_checkbox"),
    toggle_pins_label = toggle_pins_checkbox.nextElementSibling,
    more_information_label = document.querySelectorAll(".svg__tools__label")[1];

// Step 2: Add event to checkbox
toggle_pins_checkbox.addEventListener("change", function () {
    
    // Step 3: Check all pins
    all_pins.forEach(function (object) {
        if (object.classList.contains("pin_shown")) {
            // Step 3a: Set all pins to hidden if they were shown
            object.classList.remove("pin_shown");

            // Change some texts
            more_information_label.innerHTML = "Click on a region to get more information."
            toggle_pins_label.innerHTML = "Show cities";
        } else {
            // Step 3b: Set all pins to shown if they were hidden
            object.classList.add("pin_shown");
            // Change some texts
            more_information_label.innerHTML = "Click on a region/city to get more information."
            toggle_pins_label.innerHTML = "Hide cities";

        }
    });
});



//#endregion


//#region "Zoom SVG box"
// Get slider
var zoom_slider = document.querySelector("#zoom_svg_slider");
zoom_slider.addEventListener("change", function () {
    ZoomSVG(zoom_slider.value);
});

function ZoomSVG(zoom_value) {
    // Get SVG box
    var svg = document.querySelector("#game_of_thrones_world_map_svg");
    // Update the height of the SVG element
    svg.style.height = zoom_value + "vh";
}

//#endregion