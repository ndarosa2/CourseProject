
const POS_object = {
    CC: "Coord Conjunction",
    CD: "Cardinal number",
    DT: "Determiner",
    EX: "Existential there",
    FW: "Foreign word",
    IN: "Preposition",
    JJ: "Adjective",
    JJR: "Adjective, comparative",
    JJS: "Adjective, superlative",
    LS: "List item marker",
    MD: "Modal",
    NN: "Noun, singular",
    NNP: "Proper noun, singular",
    NNPS: "Proper noun, plural",
    NNS: "Noun, plural",
    PDT: "Predeterminer",
    POS: "Possessive ending",
    PRP: "Personal pronoun",
    PRP$: "Possessive pronoun",
    RB: "Adverb",
    RBR: "Adverb, comparative",
    RBS: "Adverb, superlative",
    RP: "Particle",
    SYM: "Symbol",
    TO: "To",
    UH: "Interjection",
    VB: "Verb, base form",
    VBD: "Verb, past tense",
    VBG: "Verb, gerund",
    VBN: "Verb, past participle",
    VBP: "Verb, present",
    VBZ: "Verb, present",
    WDT: "Wh-determiner",
    WP: "Wh pronoun",
    WP$: "Possessive-Wh",
    WRB: "Wh-adverb",
};


function analyseText() {
    //const text_analysed_array = compendium.analyse('Nick is having a bad day. I hate oreos');
    const text = document.getElementById("text_input").value;
    console.log("how are things going");
    if (text != ""){
        const text_replaced = text.replaceAll(/[?!.(),\[\]#-:;]/g, " ");
        // analyse the text but dont process for numeric and negation functions. 
        //const text_analysed_array = compendium.analyse(document.getElementById("text_input").value, null, ['numeric','negation']);
        // const text_analysed_array = compendium.analyse(text_replaced, null, ['numeric', 'negation']);
        const text_analysed_array = compendium.analyse(text_replaced, null, ['numeric', 'negation']);
        const tags_array = text_analysed_array[0].tags;
        const tokens_array = text_analysed_array[0].tokens;
        const sentiment_score = text_analysed_array[0].profile.sentiment;
        const sentiment_label = text_analysed_array[0].profile.label;
        const tense = text_analysed_array[0].profile.main_tense;
        document.getElementById("sentiment_score_label").innerHTML = "<b>Sentiment Score: " + sentiment_score + "  Sentiment Label: " + sentiment_label + "</b>";

        createTable(tokens_array, tags_array);

        var people = getEntities("people", text_replaced);
        document.getElementById("people").innerHTML = "People: " + people;
        var places = getEntities("places", text_replaced);
        document.getElementById("places").innerHTML = "Places: " + places;
        var organizations = getEntities("organizations", text_replaced);
        document.getElementById("organizations").innerHTML = "Organizations: " + organizations;
    }
}

function getEntities(type, input_text) {
    var entities_string = "";
    if (type == "places") {
        entities_object = nlp(input_text).places().list;

    } else if (type == "organizations") {
        entities_object = nlp(input_text).organizations().list;

    } else if (type == "people") {
        entities_object = nlp(input_text).people().list;
    } else {
        entities_object = nlp(input_text).topics().list;
    }
    //const entities_array = [];
    for (var i = 0; i < entities_object.length; i++) {
        var entities_terms = entities_object[i].cache.terms;
        var entity = entities_terms[0].text;
        for (var j = 1; j < entities_terms.length; j++) {
            entity = entity + " " + entities_terms[j].text;
        }

        if (i == 0) {
            entities_string = entity;
        } else {
            entities_string = entities_string + ", " + entity;
        }
    }
    return entities_string;
}



function createTable(tokens_array, tags_array) { // implementation based on https://www.itgeared.com/how-to-create-dynamic-html-table-javascript/

    //var div1 = document.getElementById('div1');

    var tbl = document.getElementById("token_table");
    tbl.innerHTML = "";
    var row = document.createElement("tr");
    var tbl_header = document.createElement("th");
    tbl_header.innerHTML = "Token";
    row.appendChild(tbl_header);
    tbl_header = document.createElement("th");
    tbl_header.innerHTML = "Stem";
    row.appendChild(tbl_header);
    tbl_header = document.createElement("th");
    tbl_header.innerHTML = "Part of Speech";
    row.appendChild(tbl_header);
    tbl.appendChild(row); // add the row

    for (var i = 0; i < tokens_array.length; i++) {
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        cell.innerHTML = tokens_array[i].raw;
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.innerHTML = tokens_array[i].stem;
        row.appendChild(cell);

        cell = document.createElement("td");
        if (tags_array[i] in POS_object) {
            cell.innerHTML = POS_object[tags_array[i]];

        } else {
            cell.innerHTML = tags_array[i];
        }

        row.appendChild(cell);

        tbl.appendChild(row); // add the row
    }
}

//document.getElementById("text_input").addEventListener("input", clickDemo);
document.getElementById("text_input").addEventListener("input", analyseText);
//document.getElementById("text_input").oninput = analyseText;
//function clickDemo(){
//console.log("Hi there")
//}

