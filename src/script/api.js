var $QUERY_TYPE;
var $QUERY_PAGE;
var $QUERY_SIZE;
var $QUERY_FILTER;
var $QUERY_PARAMETER;

var all_characters = Array();
var times_to_call_api;
var card__wrapper = document.querySelector(".card__wrapper");

// Do the API CALL
function APICall(type, page, page_size, query_filter, query_parameter) {
    var can_continue = false;
    var type = type.toLowerCase();
    if (type != "characters" && type != "books" && type != "houses") {
        console.warn("You entered an incorrect value.");
    } else {
        // Correct value, so we can continue
        console.info("\r\nQuery called.")
        console.info("You are querying for: https://www.anapioficeandfire.com/api/" + type + "?page=" + page + "&pageSize=" + page_size + query_filter + query_parameter);                            
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
                        console.info("\r\nWe got the result, now processing...\r\n");
                        ProcessAPIResult(result, page, query_parameter);
                    }
                }
            };
            xhttp.open('GET', 'https://www.anapioficeandfire.com/api/' + type + '?page=' + page + '&pageSize=' + page_size + query_filter + query_parameter, true);
            xhttp.send();
        }
        catch (error) {
            console.warn("An error occured here!");
        }
    }
   
}

function QueryRegion(elem) {

    // Clear all the characters from the current list
    all_characters.length = 0;
    
    // Remove all the items
    while (card__wrapper.firstChild) {
        card__wrapper.removeChild(card__wrapper.firstChild);
    }

    // Our keys are made out of all the Land / Continent id's
    var key_to_search_for = elem.id;
    var value = cultures[key_to_search_for];

    $QUERY_TYPE = "characters";
    $QUERY_SIZE = 50;
    $QUERY_FILTER = "&Culture=";
    // Check if we have encountered an Array or not...
    if (value instanceof Array) {
        // Dealing with an array here ...

        // We would like to keep track of how many times we have to process the API.
        // In other words: How many items are there inside our array?
        times_to_call_api = value.length;        

        // Do something with each object then
        for (var index = value.length - 1; index >= 0; index--) {
            var element = value[index];
            // console.info(element);
            $QUERY_PAGE = 1;
            $QUERY_PARAMETER = element;
            APICall($QUERY_TYPE, $QUERY_PAGE, $QUERY_SIZE, $QUERY_FILTER, $QUERY_PARAMETER);
        }

    } else {
        // console.info(value);
        // Since we can only proceed when 'times_to_call_api' is set to 0, we will act set it to 1 first.
        times_to_call_api = 1;        
        $QUERY_PAGE = 1;
        $QUERY_PARAMETER = value;
        APICall($QUERY_TYPE, $QUERY_PAGE, $QUERY_SIZE, $QUERY_FILTER, $QUERY_PARAMETER);
    }

}


// We need all these parameters to do the query again
function ProcessAPIResult(result, query_page, query_parameter) {
    // Push the items into the array
    all_characters.push.apply(all_characters, result);

    console.info("Added " + result.length + " characters.")

    if (result.length < $QUERY_SIZE) {
        console.info("Added all characters of " + query_parameter);
        console.info("\r\n");
        console.info(all_characters);

        // Everytime we finished one culture, we will decrease the amount of times we still have to complete it
        times_to_call_api--;
    } else {
        // Set new page index
        query_page = query_page + 1;
        console.info("Proceed to page: " + query_page);
        APICall($QUERY_TYPE, query_page, $QUERY_SIZE, $QUERY_FILTER, query_parameter);
    }

    if (times_to_call_api == 0) {
        console.info("\r\n\r\n ----- We have finished our calls, NOW PROCEED!!! ----- \r\n\r\n");
        // Now that we got everything, we can do something with it
        UpdateCardsWithCharacters(0, 8);
    }

}

// Here we will create an article for each character that we wish to display
var min_value = 0;
var max_value = 0;
function UpdateCardsWithCharacters(min, max) {
    var load_more_card = document.querySelector('#load_more');
    if (document.body.contains(load_more_card) === true) {
        if (max_value > all_characters.length) {
            AddClass(load_more_card, "hidden");
        }
    }
    min_value = min;
    max_value = max;
    page_size = max - min;
    console.info("Load from: " + min_value + " untill " + max_value);
    if (all_characters.length <= 9) {
        var array_to_show = all_characters;
    } else {
        var array_to_show = all_characters.slice(min_value, max_value);
    }
    
    // Setup the next page card
    if ((all_characters.length > 9) && (document.body.contains(load_more_card) === false)) {
        
        AddObjectsToElement(card__wrapper, "article.card.load_more_characters > section.card__section > h1{Load next page of characters}");
        // article = document.createElement("article");
        // article.classList.add("card");
        // article.id = "load_more";

        // section = document.createElement("section");
        // section.classList.add("card__section");
        // load_more__title = document.createElement("h1");
        // load_more__title.appendChild(document.createTextNode("Load next page of characters"))
        // section.appendChild(load_more__title);

        // article.appendChild(section);
        // card__wrapper.appendChild(article);

        document.querySelector('.load_more_characters').addEventListener("click", function () {
            if (page_size == 8) {
                UpdateCardsWithCharacters(min_value + page_size, max_value + page_size + 1);                
            } else {
                UpdateCardsWithCharacters(min_value + page_size, max_value + page_size);                                
            }
        });
    }

    array_to_show.forEach(function (object){
        BuildArticle(object);
    });

}

function DOMText(text) {
    return document.createTextNode(text);
}

function BuildArticle(object) {
    var $NAME = DOMText(object.name);
    var $GENDER = object.gender;
    var $CULTURE = DOMText(object.culture);
    var has_actor = false;

    if (object.born === "") {
        object.born = "Unknown";
    }
    if (object.died === "") {
        object.died = "Unknown";
    }
    var $ACTOR = DOMText(object.playedBy[object.playedBy.length - 1]);
    if (object.playedBy[object.playedBy.length - 1] != "") {
        has_actor = true;
    }
    var $BORN = DOMText(object.born);
    var $DIED = DOMText(object.died);

    var $GENDER_ICON;

    switch ($GENDER) {
        case "Male":
            $GENDER_ICON = "fa-mars";
            break;
        case "Female":
            $GENDER_ICON = "fa-venus";
            break;
        default:
            break;
    }
    // Create article
    article = document.createElement("article");
    article.classList.add("card");

    header = document.createElement("header");
    header.classList.add("card__header");
    header__span = document.createElement("span");
    header__span.classList.add("card__name");
    header__span__title = document.createElement("h1");
    header__span__title.appendChild($NAME);
    header__span.appendChild(header__span__title);
    header.appendChild(header__span);
    header__gender__icon = document.createElement("i");
    header__gender__icon.classList.add("fa");
    header__gender__icon.classList.add($GENDER_ICON);
    header__gender__icon.classList.add("fa-pull-right");
    header.appendChild(header__gender__icon);

    article.appendChild(header);

    section = document.createElement("section");
    section.classList.add("card__section");
    // First line
    section__line = document.createElement("span");
    section__line.classList.add("card__section__line");
    section__line_left = document.createElement("span");
    section__line_left.classList.add("pull-left");
    section__line_left.appendChild(DOMText("Culture:"));
    section__line.appendChild(section__line_left);

    section__line_right = document.createElement("span");
    section__line_right.classList.add("pull-right");
    section__line_right.appendChild($CULTURE);
    section__line.appendChild(section__line_right);

    section.appendChild(section__line);

    // Second Line
    section__line = document.createElement("span");
    section__line.classList.add("card__section__line");
    section__line_left = document.createElement("span");
    section__line_left.classList.add("pull-left");
    section__line_left.appendChild(DOMText("Born:"));
    section__line.appendChild(section__line_left);

    section__line_right = document.createElement("span");
    section__line_right.classList.add("pull-right");
    section__line_right.appendChild($BORN);
    section__line.appendChild(section__line_right);

    section.appendChild(section__line);

    // Third Line
    section__line = document.createElement("span");
    section__line.classList.add("card__section__line");
    section__line_left = document.createElement("span");
    section__line_left.classList.add("pull-left");
    section__line_left.appendChild(DOMText("Died:"));
    section__line.appendChild(section__line_left);

    section__line_right = document.createElement("span");
    section__line_right.classList.add("pull-right");
    section__line_right.appendChild($DIED);
    section__line.appendChild(section__line_right);

    section.appendChild(section__line);

    // Fourth Line
    if (has_actor === true) {
        section__line = document.createElement("span");
        section__line.classList.add("card__section__line");
        section__line_left = document.createElement("span");
        section__line_left.classList.add("pull-left");
        section__line_left.appendChild(DOMText("Played by:"));
        section__line.appendChild(section__line_left);

        section__line_right = document.createElement("span");
        section__line_right.classList.add("pull-right");
        section__line_right.appendChild($ACTOR);
        section__line.appendChild(section__line_right);

        section.appendChild(section__line);
    }


    article.appendChild(section);

    // Append the whole card to our article
    card__wrapper.insertBefore(article, document.querySelector("#load_more")); 
}