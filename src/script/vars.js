

// We can use these elements as the variables from the SASS file _colors.scss if we want to.
// var colors = {"Red": "#ff0000"}


var all_characters = Array();
var cultures = {
    "Braavos": "Braavosi",
    "Westeros": ["Westeros", "Andal", "First Men", "Rhoynar"],
    "Kings_Landing": "Westeros",
    "Valyria": "Valyrian",
    "The_Stormlands": "Stormlands",
    "The_Iron_Islands": "Ironborn",
    "The_North": ["Northmen", "Northern mountain clans", "Crannogmen"],
    "The_Vale": ["Valemen", "Mountain clans", "Sistermen"],
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
    "The_Land_of_Always_Winter": ["Free Folk", "Thenn"],
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


var cities = []; // Take all the cities for our searchbar
var regions = []; // Take all the regions for our searchbar
var unique_cultures = []; // Take all the cultures for our searchbar

Object.keys(cultures).forEach(function (element) {
    var unique_culture = cultures[element];
    if (unique_culture instanceof Array) {
        for (var index = 0; index < unique_culture.length; index++) {
            var value = unique_culture[index];
            if (unique_cultures.includes(value) == false) {
                unique_cultures.push(value);
            }
        }
    } else {
        if (unique_cultures.includes(unique_culture) == false) {
            unique_cultures.push(unique_culture);
        }
    }
});