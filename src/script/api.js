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

function QueryRegion(elem, culture) {
    culture = typeof culture === "undefined" ? "" : culture;

    // Clear all the characters from the current list
    all_characters.length = 0;
    
    // Remove all the items
    ClearElementsChildren(card__wrapper);

    // Our keys are made out of all the Land / Continent id's
    if (culture === "") {
        var key_to_search_for = elem.id;
        var value = cultures[key_to_search_for];
    } else {
        var value = elem;
    }

    if (value == undefined) {
        AddObjectsToElement(card__wrapper, "section.card__section > h1{Sorry, we cannot show you characters for this region, as there are none in the API}");        
    } else {

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
        // Remove all the items
        ClearElementsChildren(card__wrapper);
        UpdateCardsWithCharacters(0, 8);
    }

}

// Here we will create an article for each character that we wish to display
var min_value = 0;
var max_value = 0;

function ClearElementsChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function UpdateCardsWithCharacters(min, max) {
    var load_more_card = document.querySelector('.load_more_characters');
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
        document.querySelector('.load_more_characters').addEventListener("click", function () {
            if (page_size == 8) {
                UpdateCardsWithCharacters(min_value + page_size, max_value + page_size + 1);                
            } else {
                UpdateCardsWithCharacters(min_value + page_size, max_value + page_size);                                
            }
        });
    }

    // Build an article for every item
    array_to_show.forEach(function (object){
        BuildArticle(object);
    });

}

function DOMText(text) {
    return document.createTextNode(text);
}

var i = 0;

function BuildArticle(object) {
    i++;
    // If the character doesn't have a name, at least try to return an alias if it's possible...
    if (object.name == "" && object.aliases[object.aliases.length - 1] != "") {
        var $NAME = "(" + object.aliases[object.aliases.length -1] + ")";
    } else if (object.name != "") {
        var $NAME = object.name.replace(".", ""); // Since we cannot have dots in our texts, and some characters do contain them for a reason, we remove them
    } else {
        var $NAME = "Unknown character";
    }
    var $GENDER = object.gender; 
    if (object.culture === "" ) {
        var $CULTURE = "Unknown";        
    } else {
        var $CULTURE = object.culture;
    }
    // If this is set to true, the charactor's actor will be displayed. Eventually, we could link this to another API to get actor/actress images.
    var has_actor = false;

    if (object.born === "") {
        object.born = "Unknown";
    }
    if (object.died === "") {
        object.died = "Unknown";
    }
    var $ACTOR = object.playedBy[object.playedBy.length - 1];
    if (object.playedBy[object.playedBy.length - 1] != "") {
        has_actor = true;
    }
    var $BORN = object.born.split(".").join(" ").trim(); // Since we cannot have dots in our texts, and some characters do contain them for a reason, we remove them
    var $DIED = object.died.split(".").join(" ").trim(); // Since we cannot have dots in our texts, and some characters do contain them for a reason, we remove them

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
    
    AddObjectsToElement(card__wrapper, "article.card.card-" + i);
    var newly_created_card = document.querySelector(".card-" + i);
    AddObjectsToElement(newly_created_card, "header.card__header + section.card__section");    
    var newly_created_card_header = document.querySelector(".card-" + i + " header.card__header");     
    var newly_created_card_section = document.querySelector(".card-" + i + " section.card__section"); 

    AddObjectsToElement(newly_created_card_header, "span.card__name > h1{" + $NAME + "} + i.fa.fa-pull-right." + $GENDER_ICON)

    var values = [
        ["Culture:", $CULTURE],
        ["Born:", $BORN],
        ["Died:", $DIED],
    ]
    if  (has_actor === true) {
        var actor_line = ["Played By:", $ACTOR];
        values.push(actor_line);
    }
    for (var index = 0; index < values.length; index++) {
        var element = values[index];
        AddObjectsToElement(newly_created_card_section, "span.card__section__line");
        AddObjectsToElement(GetSectionLine(index), "span.pull-left{"+ element[0] +"} + span.pull-right{" + element[1] + "}");
    }

    function GetSectionLine(number) {
        var newly_created_card_section_line = document.querySelectorAll(".card-" + i + " span.card__section__line");
        var last_line = newly_created_card_section_line[number];
        return last_line;
    }
   
}