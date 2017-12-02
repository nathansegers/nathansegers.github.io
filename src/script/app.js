'use strict';
console.info("Hello there!")

var all_characters = Array();
var all_unique_cultures = ['Braavosi', 'Westeros', 'Valyrian', 'Stormlands', 'Ironborn', 'Andal', 'Northmen', 'Valemen', 'Reach', 'Dornish', 'Northern mountain clans', 'Rivermen', 'First Men', 'Westerman', 'Sistermen', 'Ghiscari', 'Crannogmen', 'Westerlands', 'Asshai', 'Rhoynar', 'Tyroshi', 'Myrish', 'Thenn', 'Free Folk', 'Dothraki', 'Norvoshi', 'Ibbenese', 'Summer Isles', 'Meereenese', 'Mountain clans', 'Astapori', 'Lysene', 'Qartheen', 'Lhazareen', 'Free folk', 'Pentoshi', 'Naathi', 'Qohor'];

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

function AddCulturesToList() {
    var picker = document.querySelector('#picker');
    for (var i = 0; i < all_unique_cultures.length; i++) {
        var element = all_unique_cultures[i];
        var option = document.createElement("option");
        option.text = element;
        picker.add(option)
    }
}
AddCulturesToList();