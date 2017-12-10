var search_bar = document.querySelector(".header__search_bar__input");
var search_bar_results = document.querySelector(".header__search_bar__result");
search_bar.addEventListener('input', function (e) {
    // Allow the user to type something
    if (e.target.value.length > 2) {
        RemoveClass(search_bar_results, "closed");
        AddObjectsToElement(search_bar_results, "b{You Typed:} + span{"+ e.target.value +"}")
    } else {
        AddClass(search_bar_results, "closed");       
    }
});