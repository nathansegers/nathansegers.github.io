'use strict';
console.info("Hello there!")

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


    HideAllPinsAndTitles();

    // Function to set all items to hidden;
    function HideAllPinsAndTitles() {
        all_titles.forEach(function (elem) {
            elem.classList.remove("visible");
            elem.classList.add("invisible");
        });
        all_pins.forEach(function (elem) {
            elem.classList.remove("visible");
            elem.classList.add("invisible");            
        });
        all_lands.forEach(function (elem) {
            elem.classList.remove("clicked");
        })
    }


    // For each land-object
    all_lands.forEach(function (elem) {
        // Do a function on mouse over
        elem.addEventListener("mouseover", function () {
            // Show the title of this element
            ShowLandTitle(elem.id);
        });
        elem.addEventListener("mouseout", function() {
            // Show the title of this element
            HideLandTitle(elem.id);
        })
        elem.addEventListener("click", function() {
            // We only want our clicked element to be visible, so we hide all the rest
            HideAllPinsAndTitles();
            ObjectClicked(elem);
        });

    });
});

function ShowLandTitle(land_id) {
    var land_title = document.querySelector(".text_" + land_id);
    land_title.classList.remove("invisible");
    land_title.classList.add("visible");
}
function HideLandTitle(land_id) {
    var land_title = document.querySelector(".text_" + land_id);
    land_title.classList.remove("visible");
    land_title.classList.add("invisible");
}
function ObjectClicked(object) {
    var object_title = document.querySelector(".text_" + object.id);
    // Show land title
    object.classList.add("clicked");
    console.log(object_title.classList);
    object_title.classList.add("visible");
    console.log(object_title.classList);
    
    // Set the fill color of this object to RED
    console.log(object);
}



