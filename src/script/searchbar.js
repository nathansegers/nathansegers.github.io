var search_bar = document.querySelector(".header__search_bar__input");
var search_bar_results = document.querySelector(".header__search_bar__result");
var globalTimeout = null;
var header_title = document.querySelector(".header__title");
var header__search_bar = document.querySelector(".header__search_bar");
document.addEventListener("DOMContentLoaded", function() {
    header__search_bar.addEventListener("click", function () {
        if (window.outerWidth <= 535) {
            AddClass(header__search_bar, "search_bar_opened");
            AddClass(header_title, "hidden");
        }
    });
});


search_bar.addEventListener('input', function (e) {
    if (e.target.value.length == 0) {
        // When something is typed, set the search_bar to open
        RemoveClass(search_bar_results, "opened");
        RemoveClass(header_title, "hidden");
    }
    if (e.target.value.length > 1) {
        if (window.outerWidth <= 675) {
            console.log("Resetting font-size");
            AddClass(header_title, "hidden");
        }
        // Clear the object
        AddClass(search_bar_results, "opened");
        ClearElementsChildren(search_bar_results);
        // AddObjectsToElement(search_bar_results, "span.search__result__title")
        // AddObjectsToElement(search_bar_results.firstChild, "strong{You Typed: } + span{"+ e.target.value +"}")
        if (e.target.value.includes(':')) {
            var regex_after_value = /\:(.*)/g;
            var regex_before_value = /(.+?(?=\:))/g;
            var value_to_search_for = regex_after_value.exec(e.target.value)[1].trim();
            var type_to_search_for = regex_before_value.exec(e.target.value)[1];
            SearchElement(value_to_search_for, type_to_search_for.toLowerCase());
        } else {
            SearchElement(e.target.value);
        }
       
    }
});

function SearchElement(search_value, type) {
    type = typeof type === "undefined" ? "" : type;
    var counters = {};
    type_number = 0;
    switch (type) {
        case "region":
        case "regions":
        case "reg":
            SearchInArray(regions, "Regions");
            break;
        case "city":
        case "cities":
            SearchInArray(cities, "Cities");
            break;
        case "culture":
        case "cultures":
        case "cult":
            SearchInArray(unique_cultures, "Cultures");
            break;
        case "character":
        case "char":
        case "person":
            AddObjectsToElement(search_bar_results, "i.fa.fa-spinner.fa-pulse.fa-4x + span{Please wait while we search that character&DOT;&DOT;&DOT;}");                                
        // AddObjectsToElement(search_bar_results, "div.text-warning > span{We are searching for the character named: '" + search_value +"', please be patient!}");
            if (globalTimeout != null) clearTimeout(globalTimeout);
                globalTimeout = setTimeout(function() {
                    if (search_value != "") {
                        console.log("We can continue now ...");
                        times_to_call_api = 1;
                        all_characters.length = 0;
                        APICall("characters", 0, 50, "&Name=", search_value);
                    } else {
                        console.log("Waiting for a value to be entered");
                    }
            }, 500);
        break;

        default:
            SearchInArray(regions, "Regions");
            SearchInArray(cities, "Cities");
            SearchInArray(unique_cultures, "Cultures");
            break;
    }
    
    if (counters["Number-1"] == 0 && counters["Number-2"] == 0 && counters["Number-3"] == 0) {
        AddObjectsToElement(search_bar_results, "div.text-warning > span{We did not find anything with that query&DOT; Please try something else or be more specific&DOT;}");                        
    }

    function SearchInArray(array_name, type) {

        type_number++;
        counters["Number-" + type_number] = 0;

        array_name.forEach(function (element) {
            if (element.toLowerCase().includes(search_value.toLowerCase())) {
                counters["Number-" + type_number]++;                
                if (counters["Number-" + type_number] == 1) {
                    AddObjectsToElement(search_bar_results, "div.search__option__group__title > span{" + type +"}");
                }
                AddObjectsToElement(search_bar_results, "span.search__option."+type+"{" + element + "}");
                addEventsToSearchOptions();
            }
        });
    }
}

function SetSearchbarValue(type, value) {
    value = value.split("_").join(" ");
    search_bar.value = type + value;
}

function addEventsToSearchOptions(){

    search_bar_results.addEventListener('click', function (e) {
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        if (e.target && e.target.classList.contains("search__option")) {
            var inner_value = e.target.innerHTML;
            var id_to_search_for = inner_value.split(" ").join("_");
            var type = e.target.classList[e.target.classList.length - 1];
            var element = document.querySelector("#" + id_to_search_for);
            HideAllCities();            
            ResetAllClasses();
            switch (type) {
                case "Regions":
                    ToggleClass(element, "land__clicked");
                    CheckDependencies("click", element);
                    QueryRegion(element);
                    break;

                case "Cities":
                    ToggleClass(element, "pins__clicked");
                    QueryRegion(element);
                    break;

                case "Cultures":
                    QueryRegion(inner_value, "culture");

                default:
                    break;
            }
            RemoveClass(search_bar_results, "opened");
            SetSearchbarValue(type + ": ", inner_value);
            
        } else if (e.target) {
            console.log(e.target);
        }
    });

}