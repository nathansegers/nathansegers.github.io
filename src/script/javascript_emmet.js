function CreateHTMLObject(object_reference) {

    var StartPos = 0;
    var StopPos = 0;
    var text = "";
    var parent = "";

    // If object needs classes
    if (object_reference.includes('.')) {
        // Seperate the classes from the object
        var splitted = object_reference.split(".");
        parent = document.createElement(splitted[0]);
        for (var index = 1; index < splitted.length; index++) {
            var element = splitted[index];
            if (element.includes('{')) {
                StartPos = element.search('{');
                StopPos = element.search('}');
                text = document.createTextNode(element.substring(StartPos + 1, StopPos).split("&DOT;").join("."));
                parent.classList.add(element.substring(0, StartPos));
                parent.appendChild(text);
            } else {
                parent.classList.add(element.replace(" ", ""));                
            }
        }
    } else {
        // Doesn't contain class, but may contain text
        // Seperate the text from the object
        CheckForText(object_reference);
    }

    function CheckForText(object) {

        if (object.includes('{')) {
            StartPos = object.search('{');
            StopPos = object.search('}');
            // Child element was between those two brackets
            text = document.createTextNode(object.substring(StartPos + 1, StopPos).split("&DOT;").join("."));
            // If we already have a parent, just add the text
            if (parent != "") {
                parent.appendChild(text);
            } else {
                // Who is the parent then?
                // Parent is the object from the beginning untill the first bracket. E.g.: h2{text}
                parent = document.createElement(object.substring(0, StartPos));
                // Child remains the same
                parent.appendChild(text);
            }
        }
    }

    return parent;
}
function AddObjectsToElement(object_to_add_to, object_reference) {
    var parent = object_to_add_to;
    if (object_reference.includes(' + ')) {
        var siblings = object_reference.split(' + ');
        for (var i = 0; i < siblings.length; i++) {
            //        alert(siblings[i]);
            AddObjectsToElement(parent, siblings[i]);
        }
    } else {
        var references = object_reference.split(' > ');
        for (var index = 0; index < references.length; index++) {
            var element = CreateHTMLObject(references[index]);
            parent.appendChild(element);
            // Element is parent for the next one
            parent = element;
        }
    }
}

// function AppendBefore(parent_object, child_object, sibling_object) {
//     parent_object.insertBefore(child_object, sibling_object);
// }

// HOW TO USE:
// AddObjectsToElement(element_to_add_to, "article.card.class2.class3 > header.card__header > span.card__name > h2{Jon Snow}");