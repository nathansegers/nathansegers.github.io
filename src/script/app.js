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
            CheckDependencies("click", elem);            
            // Check if there are other elements that depend on this one (For example: The Neck depends on the North but not the other way around)
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

