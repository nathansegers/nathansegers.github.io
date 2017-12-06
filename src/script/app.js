'use strict';
console.info("Hello there!")

// We can use these elements as the variables from the SASS file _colors.scss if we want to.
// var colors = {"Red": "#ff0000"}


var all_characters = Array();
var all_unique_cultures = ['Braavosi', 'Westeros', 'Valyrian', 'Stormlands', 'Ironborn', 'Andal', 'Northmen', 'Valemen', 'Reach', 'Dornish', 'Northern mountain clans', 'Rivermen', 'First Men', 'Westerman', 'Sistermen', 'Ghiscari', 'Crannogmen', 'Westerlands', 'Asshai', 'Rhoynar', 'Tyroshi', 'Myrish', 'Thenn', 'Free Folk', 'Dothraki', 'Norvoshi', 'Ibbenese', 'Summer Isles', 'Meereenese', 'Mountain clans', 'Astapori', 'Lysene', 'Qartheen', 'Lhazareen', 'Pentoshi', 'Naathi', 'Qohor'];

function APICall(type, page, page_size) {
    var xhttp = new XMLHttpRequest(),
        type = type.toLowerCase();
        if (type != "characters" && type != "books" && type != "houses" ) {
            alert.info("You entered an incorrect value.");
        }
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(xhttp.responseText);
            // Add result to cultures
            all_characters = all_characters.concat(result);
            console.log(all_characters);
            console.info('https://www.anapioficeandfire.com/api/' + type + '?page=' + page + '&pageSize=' + page_size);
        }
    };
    xhttp.open('GET', 'https://www.anapioficeandfire.com/api/' + type + '?page=' + page + '&pageSize=' + page_size, true);
    xhttp.send();
}

// function AddCulturesToList() {
//     var picker = document.querySelector('#picker');
//     for (var i = 0; i < all_unique_cultures.length; i++) {
//         var element = all_unique_cultures[i];
//         var option = document.createElement("option");
//         option.text = element;
//         picker.add(option)
//     }
// }
// AddCulturesToList();


document.addEventListener("DOMContentLoaded", function (event) {
    var all_lands = document.querySelectorAll("[class*=land_]");
    var all_pins = document.querySelectorAll("[class*=pin_]");
    var all_titles = document.querySelectorAll("[class*=text_]");
    var all_continents = document.querySelectorAll(".continent");

    ResetAllClasses();

    // Function to set all items to hidden;
    function ResetAllClasses() {
        all_lands.forEach(function (elem) {
            elem.classList.remove("land__clicked");
        });
        all_continents.forEach(function (elem) {
            elem.parentElement.classList.remove("continent__clicked");
        });
    }


    // For each land-object
    all_lands.forEach(function (elem) {
        // Do a function on mouse over
        elem.addEventListener("mouseover", function () {
            elem.classList.add("land__hovered");
            CheckDependencies("mouseover", elem);
        });
        elem.addEventListener("mouseout", function() {
            elem.classList.remove("land__hovered"); 
            CheckDependencies("mouseout",elem);
        })
        elem.addEventListener("click", function() {
            ResetAllClasses();
            // We only want our clicked element to be visible, so we hide all the rest
            if (elem.classList.contains("land__clicked")) {
                elem.classList.remove("land__clicked");
            } else {
                elem.classList.add("land__clicked");
            }
            // Check if there are other elements that depend on this one (For example: The Neck depends on the North but not the other way around)
            CheckDependencies("click", elem);            

            ScrollToElement(elem.id);
            
        });
    });

    // For each continent title
    all_continents.forEach(function (elem) {
        elem.addEventListener("mouseover", function() {
            elem.parentElement.classList.add("continent__hovered");
        });
        elem.addEventListener("mouseout", function() {
            elem.parentElement.classList.remove("continent__hovered");            
        });
        elem.addEventListener("click", function () {
            ResetAllClasses();
            // We only want our clicked element to be visible, so we hide all the rest
            if (elem.parentElement.classList.contains("continent__clicked")) {
                elem.parentElement.classList.remove("continent__clicked");            
            } else {
                elem.parentElement.classList.add("continent__clicked");            
            }


        });
    });

    function CheckDependencies(type, elem) {
        var class_to_add = "";
        var remove = false;
        switch (type) {
            case "mouseover":
                class_to_add = "land__hovered";
                break;
            case "mouseout":
                class_to_add = "land__hovered";
                remove = true;
                break;
            case "click":
                class_to_add = "land__clicked";
                break;
            default:
                break;
        }
        var class_name = ".part_of_" + elem.id;
        var all_dependend_lands = document.querySelectorAll(class_name);
        all_dependend_lands.forEach(function (object) {
            if (remove == true) {
                object.classList.remove(class_to_add);
            } else {
                object.classList.add(class_to_add);
            }
        });
    }


    //                      ---- Show cities ----
    
    // Get checkbox
    var toggle_pins_checkbox = document.querySelector("#toggle_pins_checkbox");
    // When checkbox is clicked ...
    toggle_pins_checkbox.addEventListener("change", function() {
        all_pins.forEach(function (object) {
            if (object.classList.contains("pin_shown")) {
                object.classList.remove("pin_shown");
                document.querySelectorAll(".svg__tools__label")[1].innerHTML = "Click on a region to get more information."
                toggle_pins_checkbox.nextElementSibling.innerHTML = "Show cities";
            } else {
                object.classList.add("pin_shown");
                document.querySelectorAll(".svg__tools__label")[1].innerHTML = "Click on a region/city to get more information."                
                toggle_pins_checkbox.nextElementSibling.innerHTML = "Hide cities";
                
            }
        });
    });


    //                      ---- Zoom In SVG ----
    var zoom_slider = document.querySelector("#zoom_svg_slider");
    zoom_slider.addEventListener("change", function () {
        ZoomSVG(zoom_slider.value);
    });

   


    //                      ---- Measure the Scrollbar ----

    // Create the measurement node
    var scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv);

    // Get the scrollbar width
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    console.info(scrollbarWidth);

    // Delete the DIV 
    document.body.removeChild(scrollDiv);


    // Now we can use this scrollbarWidth for some elements:
    var svg__tools__box = document.querySelector(".svg__tools");
    svg__tools__box.style.bottom = 30 + scrollbarWidth + "px";

// End "DOMContentLoaded"
});


function ScrollToElement(element_query) {
    // Get the element
    var element_to_scroll_to = document.querySelector("#" + element_query);
    // Get the boundaries
    var bounding_box = element_to_scroll_to.getBBox();
    console.log(bounding_box);
    // We want to scroll into our section__left
    var papa = document.querySelector('.section__left');
    // Our top position should be the top position of the element minus it's height
    var scroll_to_top = bounding_box.y - (papa.clientHeight / 2);
    // Our left position should be the left position of the element minus it's width
    var scroll_to_left = bounding_box.x - (papa.clientWidth / 2)
    // Scroll the "papa" element to those positions
    papa.scrollTop = scroll_to_top;
    papa.scrollLeft = scroll_to_left;
    console.log("New position:")
    console.log("Horizontal: " + papa.scrollTop + " | Vertical: " + papa.scrollLeft)
}

function ZoomSVG(zoom_value) {
    var svg = document.querySelector("#game_of_thrones_world_map_svg");
    svg.style.height = zoom_value + "vh";
}

