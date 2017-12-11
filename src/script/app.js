'use strict';
console.info("Hello there!")
document.addEventListener("DOMContentLoaded", function (event) {

//#region "SETUP"
    // We load all the elements into our variables
    all_lands = document.querySelectorAll("[class*=land_]");
    all_pins = document.querySelectorAll("[class*=pin_]");
    all_titles = document.querySelectorAll("[class*=text_]");
    all_continents = document.querySelectorAll(".continent");
    all_continent_parents = document.querySelectorAll(".continent_wrapper");

    // Clean start!!
    ResetAllClasses();

//#endregion
//#region "Events for LANDS & CONTINENTS"

    // For each land-object
    all_lands.forEach(function (elem) {
        // Do a function on mouse over
        elem.addEventListener("mouseover", function () {
            AddClass(elem, "land__hovered");
            CheckDependencies("mouseover", elem);
        });
        elem.addEventListener("mouseout", function() {
            RemoveClass(elem, "land__hovered");            
            CheckDependencies("mouseout", elem);
        })
        elem.addEventListener("click", function() {
            ResetAllClasses();
            ToggleClass(elem, "land__clicked");
            // Check if there are other elements that depend on this one (For example: The Neck depends on the North but not the other way around)
            CheckDependencies("click", elem);
            QueryRegion(elem);
            SetSearchbarValue("Region: ", elem.id);
            
        });
        regions.push(elem.id.split("_").join(" "));
    });
    all_pins.forEach(function (elem) {
        // Do a function on mouse over
        elem.addEventListener("mouseover", function () {
            AddClass(elem, "pins__hovered");
        });
        elem.addEventListener("mouseout", function () {
            RemoveClass(elem, "pins__hovered");
        })
        elem.addEventListener("click", function () {
            ResetAllClasses();
            ToggleClass(elem, "pins__clicked");
            // Check if there are other elements that depend on this one (For example: The Neck depends on the North but not the other way around)
            QueryRegion(elem);
            SetSearchbarValue("City: ", elem.id);
            
        });
        cities.push(elem.id.split("_").join(" "));
    });
    

    // For each continent title
    all_continents.forEach(function (elem) {
        elem.addEventListener("mouseover", function() {
            AddClass(elem.parentElement, "continent__hovered");            
        });
        elem.addEventListener("mouseout", function() {
            RemoveClass(elem.parentElement, "continent__hovered");            
        });
        elem.addEventListener("click", function() {
            ResetAllClasses();
            ToggleClass(elem.parentElement, "continent__clicked");
            QueryRegion(elem.parentElement);
            SetSearchbarValue("Region: ", elem.parentElement.id);
            
        });
        regions.push(elem.parentElement.id.split("_").join(" "));
    });
//#endregion

MeasureScrollBar();

window.addEventListener("resize", function() {
    console.log("Resizing");
    MeasureScrollBar();
});

});



function MeasureScrollBar() {
    // Create the measurement node
    var scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv);
    // Get the scrollbar width
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    // Delete the DIV 
    document.body.removeChild(scrollDiv);
    // Now we can use this scrollbarWidth for some elements:
    var svg__tools__box = document.querySelector(".svg__tools");
    var footer_height = document.querySelector(".footer").clientHeight;
    if (window.innerWidth  <= 1068) {
        svg__tools__box.style.bottom = footer_height + "px";
    } else {
        svg__tools__box.style.bottom = footer_height + scrollbarWidth + "px";
    }
}



//#region "Classes"
function ToggleClass(element, class_1, class_2) {
    class_2 = typeof class_2 === "undefined" ? "" : class_2;
    // Check if element contains the class to remove
    if (element.classList.contains(class_1)) {
        RemoveClass(element, class_1);
        if (class_2 != "") {
            AddClass(element, class_2);
        }
    }
    // If it does not contain it yet, add it
    else {
        AddClass(element, class_1);
        if (class_2 != "") {
           RemoveClass(element, class_2);
        }
    }
}

function RemoveClass(element, class_to_remove) {
    element.classList.remove(class_to_remove);
}

function AddClass(element, class_to_add) {
    element.classList.add(class_to_add);
}

function ToggleClassOnMultipleElements(element_array, class_name) {
    element_array.forEach(function (object) {
        ToggleClass(object, class_name);
    });
}

function RemoveClassOnMultipleElements(element_array, class_name) {
    element_array.forEach(function (object) {
        RemoveClass(object, class_name);
    });
}

function AddClassOnMultipleElements(element_array, class_name) {
    element_array.forEach(function (object) {
        AddClass(object, class_name);
    });
}

// Function to set remove all the classes to the default
function ResetAllClasses() {
    RemoveClassOnMultipleElements(all_lands, "land__clicked");
    RemoveClassOnMultipleElements(all_continent_parents, "continent__clicked");
}
//#endregion

function CheckDependencies(type, elem) {
    // An element that's a child of someone, gets a special class ".part_of_PARENT_ID"
    var class_name = ".part_of_" + elem.id;
    // Get all those elements
    var all_dependent_lands = document.querySelectorAll(class_name);

    switch (type) {
        case "mouseover":
            AddClassOnMultipleElements(all_dependent_lands, "land__hovered")
            break;
        case "mouseout":
            RemoveClassOnMultipleElements(all_dependent_lands, "land__hovered")
            break;
        case "click":
            ToggleClassOnMultipleElements(all_dependent_lands, "land__clicked")
            break;
        default:
            break;
    }


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

