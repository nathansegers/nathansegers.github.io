'use strict';
console.info("Hello there!")

// We can use these elements as the variables from the SASS file _colors.scss if we want to.
// var colors = {"Red": "#ff0000"}

var all_characters = Array();
var cultures = {
    "Braavos": "Braavosi",
    "Westeros": ["Westeros", "Andal", "First Men", "Rhoynar"],
    "Valyria": "Valyrian",
    "The_Stormlands": "Stormlands",
    "The_Iron_Islands": "Ironborn",
    "The_North": ["Northmen", "Northern mountain clans"],
    "The_Vale": ["Valemen", "Mountain clans"],
    "The_Reach": "Reach",
    "Dorne": "Dornish",
    "Riverlands": "Rivermen",
    "Westernlands": ["Westerman", "Westerlands"],
    "The_Three_Sisters": "Sistermen",
    "New_Ghis": "Ghiscari",
    "Old_Ghis": "Ghiscari",
    "The_Neck": "Crannogmen",
    "Asshai": "Asshai",
    "Tyrish": "Tyroshi",
    "Myr": "Myrish",
    "Thenn": "Thenn",
    // "???": "Free Folk",
    "Vaes_Dothrak": "Dothraki",
    "Norvos": "Norvoshi",
    "Ib_Islands": "Ibbenese",
    "Summer_Islands": "Summer Isles",
    "Meereen": "Meereenese",
    "Astapor": "Astapori",
    "Lys": "Lysene",
    "Qarth": "Qartheen",
    "Lhazosh": "Lhazareen",
    "Pentos": "Pentoshi",
    "Naath": "Naathi",
    "Qohor": "Qohor"
}

var all_lands;
var all_continents;
var all_titles;
var all_pins;

function APICall(type, page, page_size, query) {
    console.info("You are querying for: https://www.anapioficeandfire.com/api/" + type + "?page=" + page + "&pageSize=" + page_size + query);
    try {
        var xhttp = new XMLHttpRequest(),
            type = type.toLowerCase();
            if (type != "characters" && type != "books" && type != "houses" ) {
                console.warn("You entered an incorrect value.");
            }
        xhttp.onreadystatechange = function () {
            console.info("readyState: " + this.readyState + " | status: " + this.status)
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(xhttp.responseText);
                all_characters = all_characters.concat(result);
                console.log(all_characters);
            }
        };
        xhttp.open('GET', 'https://www.anapioficeandfire.com/api/' + type + '?page=' + page + '&pageSize=' + page_size + query, true);
        xhttp.send();
    }
    catch (error){
        console.warn("An error occured here!");
    }
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
    all_lands = document.querySelectorAll("[class*=land_]");
    all_pins = document.querySelectorAll("[class*=pin_]");
    all_titles = document.querySelectorAll("[class*=text_]");
    all_continents = document.querySelectorAll(".continent");

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
            QueryAPI(elem);
            // ScrollToElement(elem.id);
            
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
        elem.addEventListener("click", function() {
            ResetAllClasses();
            // We only want our clicked element to be visible, so we hide all the rest
            if (elem.parentElement.classList.contains("continent__clicked")) {
                elem.parentElement.classList.remove("continent__clicked");            
            } else {
                elem.parentElement.classList.add("continent__clicked");            
            }
            QueryAPI(elem.parentElement);
            

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
    var scroll_to_top = bounding_box.y;
    // Our left position should be the left position of the element minus it's width
    var scroll_to_left = bounding_box.x;
    // Scroll the "papa" element to those positions
    papa.scrollTop = scroll_to_top;
    papa.scrollLeft = scroll_to_left;
    console.log("New position:")
    console.log("Horizontal: " + papa.scrollLeft + " | Vertical: " + papa.scrollTop)
}

function ZoomSVG(zoom_value) {
    var svg = document.querySelector("#game_of_thrones_world_map_svg");
    svg.style.height = zoom_value + "vh";
}


function QueryAPI(elem) {

    // Our keys are made out of all the Land / Continent id's
    var key_to_search_for = elem.id;
    var value = cultures[key_to_search_for];

    // Check if we have encountered an Array or not...
    if (value instanceof Array) {
        
        // Do something with each object then

        // 1) Make an empty string
        var query_parameter = "";
        
        value.forEach(function (object) {
            APICall("characters", 0, 10, "&Cultures=Northmen");
        });

    } else {
        APICall("characters", 0, 10, "&Cultures=" + value);
    }

}
