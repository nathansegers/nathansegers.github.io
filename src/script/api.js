// Do the API CALL
function APICall(type, page, page_size, query, query_parameter) {
    var can_continue = false;
    var type = type.toLowerCase();
    if (type != "characters" && type != "books" && type != "houses") {
        console.warn("You entered an incorrect value.");
    } else {
        // Correct value, so we can continue
        console.info("You are querying for: https://www.anapioficeandfire.com/api/" + type + "?page=" + page + "&pageSize=" + page_size + query + query_parameter);
        can_continue = true;
    }

    if (can_continue == true) {
        try {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                // log the readyState + status
                // console.log("readyState: " + this.readyState + " | status: " + this.status);

                // Correct result
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(xhttp.responseText);
                    // Only process the result when there is one
                    if (result != null) {
                        // console.info(result);
                        ProcessAPIResult(result);                        
                    }
                }
            };
            xhttp.open('GET', 'https://www.anapioficeandfire.com/api/' + type + '?page=' + page + '&pageSize=' + page_size + query + query_parameter, true);
            xhttp.send();
        }
        catch (error) {
            console.warn("An error occured here!");
        }
    }
   
}

function QueryRegion(elem) {

    // Our keys are made out of all the Land / Continent id's
    var key_to_search_for = elem.id;
    var value = cultures[key_to_search_for];

    // Check if we have encountered an Array or not...
    if (value instanceof Array) {

        console.log("Dealing with an array");
        // // Do something with each object then
        for (var index = value.length - 1; index >= 0; index--) {
            var element = value[index];
            APICall("characters", 1, 50, "&Culture=", element);
        }

    } else {
        APICall("characters", 1, 50, "&Culture=", value);        
    }

}


var all_characters = Array();
// We need all these parameters to do the query again
function ProcessAPIResult(result, page_index, page_size, query, query_parameter) {
    // Push the items into the array
    all_characters.push.apply(all_characters, result);
    // Set new page index
    var new_page_index = page_index + 1;

    
    console.info("Page index: " + new_page_index);
    console.info(all_characters);
    if (result.length < page_size) {
        console.info("Added all characters of " + query_parameter);
    } else {
        APICall("characters", new_page_index, page_size, query, query_parameter);   
    }

}