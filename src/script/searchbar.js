var search_bar = document.querySelector(".header__search_bar__input");

search_bar.addEventListener('input', function (e) {
    // Allow the user to type something
    if (e.target.value.length > 1) {
        AddObjectsToElement(search_bar, "b{You Typed:} + span{"+ e.target.value +"}")
    }
});