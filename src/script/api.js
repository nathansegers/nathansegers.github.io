// Do the API CALL
function APICall(type, page, page_size, query) {
    console.info("You are querying for: https://www.anapioficeandfire.com/api/" + type + "?page=" + page + "&pageSize=" + page_size + query);
    try {
        var xhttp = new XMLHttpRequest(),
            type = type.toLowerCase();
        if (type != "characters" && type != "books" && type != "houses") {
            console.warn("You entered an incorrect value.");
        }
        xhttp.onreadystatechange = function () {
            console.info("readyState: " + this.readyState + " | status: " + this.status)
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(xhttp.responseText);
                all_characters = all_characters.concat(result);
                console.log(all_characters);
            }
        };
        xhttp.open('GET', 'https://www.anapioficeandfire.com/api/' + type + '?page=' + page + '&pageSize=' + page_size + query, true);
        xhttp.send();
    }
    catch (error) {
        console.warn("An error occured here!");
    }
}

function QueryAPI(elem) {

    // Our keys are made out of all the Land / Continent id's
    var key_to_search_for = elem.id;
    var value = cultures[key_to_search_for];

    // Check if we have encountered an Array or not...
    if (value instanceof Array) {

        // Do something with each object then

        value.forEach(function (object) {
            APICall("characters", 0, 10, "&Cultures=Northmen");
        });

    } else {
        APICall("characters", 0, 10, "&Cultures=" + value);
    }

}