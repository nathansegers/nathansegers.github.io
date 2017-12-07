'use strict';
console.info("Hello there!")

document.addEventListener("DOMContentLoaded", function (event) {

//#region "SETUP"
    // We load all the elements into our variables
    all_lands = document.querySelectorAll("[class*=land_]");
    all_pins = document.querySelectorAll("[class*=pin_]");
    all_titles = document.querySelectorAll("[class*=text_]");
    all_continents = document.querySelectorAll(".continent");

    // Clean start!!
    ResetAllClasses();
//#endregion
//#region "Events for LANDS & CONTINENTS"

    // For each land-object
    all_lands.forEach(function (elem) {
        // Do a function on mouse over
        elem.addEventListener("mouseover", function () {
            elem.classList.add("land__hovered");
            CheckDependencies("mouseover", elem);
        });
        elem.addEventListener("mouseout", function() {
            elem.classList.remove("land__hovered"); 
            CheckDependencies("mouseout", elem);
        })
        elem.addEventListener("click", function() {
            ResetAllClasses();
            ToggleClass(elem, "land__clicked");
            // Check if there are other elements that depend on this one (For example: The Neck depends on the North but not the other way around)
            CheckDependencies("click", elem);
            QueryRegion(elem);
            
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
            ToggleClass(elem.parentElement, "continent__clicked");
            QueryAPI(elem.parentElement);
        });
    });
//#endregion


//#region "Scrollbar"

    //                      ---- Measure the Scrollbar ----
    MeasureScrollBar();

//#endregion

});


function MeasureScrollBar() {
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
}

function ToggleClass(elem, class_name) {
    if (elem.classList.contains(class_name)) {
        elem.classList.remove(class_name);
    }
    else {
        elem.classList.add(class_name);
    }
}

// Function to set remove all the classes to the default
function ResetAllClasses() {
    all_lands.forEach(function (elem) {
        elem.classList.remove("land__clicked");
    });
    all_continents.forEach(function (elem) {
        elem.parentElement.classList.remove("continent__clicked");
    });
}

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
    // An element that's a child of someone, gets a special class ".part_of_PARENT_ID"
    var class_name = ".part_of_" + elem.id;
    // Get all those elements
    var all_dependend_lands = document.querySelectorAll(class_name);
    
    // Set the correct class
    all_dependend_lands.forEach(function (object) {
        if (remove == true) {
            object.classList.remove(class_to_add);
        } else {
            object.classList.add(class_to_add);
        }
    });
}




// WORKING ON IT

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