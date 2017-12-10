var search_bar = document.querySelector(".header__search_bar__input");
var search_bar_results = document.querySelector(".header__search_bar__result");
search_bar.addEventListener('input', function (e) {
    // Allow the user to type something
    if (e.target.value.length > 2) {
        RemoveClass(search_bar_results, "closed");
        // Clear the object
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
       
    } else {
        AddClass(search_bar_results, "closed");       
    }
});


function SearchElement(search_value, type) {
    type = typeof type === "undefined" ? "" : type;
    var counters = {};
    type_number = 0;
    if (type != "undefined") {
        console.log(search_value);
    }
    switch (type) {
        case "region":
            SearchInArray(regions, "Regions");
            break;
        case "city":
            SearchInArray(cities, "Cities");
            break;
        case "culture":
            SearchInArray(unique_cultures, "Cultures");
            break;

        default:
            SearchInArray(regions, "Regions");
            SearchInArray(cities, "Cities");
            SearchInArray(unique_cultures, "Cultures");
            break;
    }
    
    if (counters["Number-1"] == 0 && counters["Number-2"] == 0 && counters["Number-3"] == 0) {
        AddObjectsToElement(search_bar_results, "div.text-warning > span{We did not find anything with that query, please try another or be more specific}");                        
    }

    function SearchInArray(array_name, type) {
        array_name = array_name.filter(Boolean);

        type_number++;
        counters["Number-" + type_number] = 0;

        array_name.forEach(function (element) {
            if (element.toLowerCase().includes(search_value.toLowerCase())) {
                counters["Number-" + type_number]++;                
                if (counters["Number-" + type_number] == 1) {
                    AddObjectsToElement(search_bar_results, "div.search__option__group__title > span{" + type +"}");
                }
                AddObjectsToElement(search_bar_results, "span.search__option > span{" + element + "}");
            }
        });
    }
}