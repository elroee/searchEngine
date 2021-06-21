//lexical analyser
function lexicalAnalyser(file) {
    var token = splitSeparators(file);
    var freqData = getFrequency(token);
    return freqData;
}

//splits string into array by removing separators and numbers
function splitSeparators(data) {
    const delims = ['.', '!', '.', '?', ',', '(', ')', '\t', '\n', '\r', ' ', '[', ']', '{', '}', '\\', ':', ';', '-', '*'];
    var dataArray = [];
    var word = "";
    for (var i = 0; i < data.length; i++) {
        if (delims.includes(data[i])) {
            if (word != "" && isNaN(word))
                dataArray.push(word.toLowerCase());
            word = "";
        }
        else
            word += data[i];

    }
    dataArray.push(word.toLowerCase());
    return dataArray;
}

//gets frequency of each word in given array and returns a two-dimensional array with word and frequency
function getFrequency(data) {
    var freq = [];
    data.sort();
    var temp = data[0];
    var tmparray = [];
    var tmpfreq = 1;
    for (var i = 1; i < data.length; i++) {
        if (data[i] == temp)
            tmpfreq++;
        else {
            tmparray.push(data[i - 1]);
            freq.push(tmpfreq);
            temp = data[i];
            tmpfreq = 1;
        }
    }
    tmparray.push(data[data.length-1]);
    freq.push(tmpfreq);
    var result = [];
    for (var i = 0; i < tmparray.length; i++) {
        result.push([tmparray[i], freq[i]]);
    }
    //var result = tmparray.concat(freq);
    return result;
}

//removes stopwords from array and return stopword removed array
function removeStopwords(data) {
    var stops = ["a", "about", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already",
        "also", "although", "always", "am", "among", "amongst", "amount", "an", "and", "another", "any", "anyhow", "anyone", "anything",
        "anyway", "anywhere", "are", "around", "as", "at", "back", "be", "became", "because", "become", "becomes", "becoming", "been", "before",
        "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom", "but", "by", "call", "can", "cannot", "cant",
        "co", "computer", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either",
        "eleven", "else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen",
        "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give",
        "go", "had", "has", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how",
        "however", "hundred", "i", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly",
        "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must",
        "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "nor", "not", "nothing", "now",
        "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out",
        "over", "own", "part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several",
        "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere",
        "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby",
        "therefore", "therein", "thereupon", "these", "they", "thick", "thin", "third", "this", "those", "though", "three", "through",
        "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until",
        "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter",
        "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom",
        "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves"];
    var tempArray = [];
    for (var i = 0; i < data.length; i++) {
        if (!stops.includes(data[i][0]) && data[i][0].length >= 3)
            tempArray.push([data[i][0], data[i][1]]);
    }
    return tempArray;
}

//remove comparative and superlative suffix
function recode(word){
    var vowel = ["a","e","i","o","u"];
    if(word.length>=4){
        if(!vowel.includes(word[word.length-1]) && !vowel.includes(word[word.length-2]) && vowel.includes(word[word.length-3]) && !vowel.includes(word[word.length-4]))
            return word.substring(0,word.length-1);
    }
    return word;
}

//removes suffixes iteratively
function suffixRemoval(data) {
    var suffix = ["able", "ible", "al", "ed", "en", "er", "or", "est", "ful", "ic", "ing", "ion", "tion", "ation", "ity", "ty", "ive", "ative", "itive",
        "less", "ly", "ment", "ness", "ous", "eous", "ious", "s", "es", "y"]
    var stemmed = [];
    var temp, tmp;
    for (var i = 0; i < data.length; i++) {
        temp = data[i][0];
        for (var j = 0; j < suffix.length; j++) {
            if (temp.includes(suffix[j]) && temp.indexOf(suffix[j]) == (temp.length - suffix[j].length)) {
                tmp = temp.substring(0, temp.length - suffix[j].length);
                if(suffix[j]=="est" || suffix[j]=="er")
                    tmp = recode(tmp);
                if (tmp.length >= 3)
                    temp = tmp;
            }
        }
        stemmed.push([temp, data[i][1]]);
    }
    return stemmed;
}

//removes prefixes iteratively
function prefixRemoval(data) {
    var prefix = ["anti", "de", "dis", "en", "em", "fore", "in", "im", "il", "ir", "inter", "mid", "mis",
        "non", "over", "pre", "re", "semi", "sub", "super", "trans", "un", "under"];

    var stemmed = [];
    var temp, tmp;
    for (var i = 0; i < data.length; i++) {
        temp = data[i][0];
        for (var j = 0; j < prefix.length; j++) {
            if (temp.includes(prefix[j]) && temp.indexOf(prefix[j]) == 0) {
                tmp = temp.substr(prefix.length);
                if (tmp.length >= 3)
                    temp = tmp;
            }
        }
        stemmed.push([temp, data[i][1]]);
    }
    return stemmed;
}

//removes prefixes and affixes and clusters words with the same root
function stemmer(data) {
    var stemmedTemp = prefixRemoval(suffixRemoval(data));
    var stemmed = [];
    var tempidx=stemmedTemp[0][0], tempfreq=stemmedTemp[0][1];
    for(var i=1; i<stemmedTemp.length; i++){
        if(stemmedTemp[i][0]==tempidx)
            tempfreq+=stemmedTemp[i][1];
        else{
            stemmed.push([tempidx,tempfreq]);
            tempidx=stemmedTemp[i][0];
            tempfreq = stemmedTemp[i][1];
        }
    }
    stemmed.push([tempidx,tempfreq]);
    return stemmed;
}


//retrieves file from localstorage if any word from query matches any index term
function retrieve(data){
    var dataArray = stemmer(removeStopwords(lexicalAnalyser(data)));
    var match=[];
    var found = false;
    var cnt=0;
    for(var i=0; i<localStorage.length; i++)
    {
        if(window.localStorage.key(i).includes("file")){
            var file = JSON.parse(window.localStorage.getItem(localStorage.key(i)));
            for(var j=0; j<dataArray.length; j++)
            {
                if(file.index.includes(dataArray[j][0]))
                {
                   //match.push(file);
                   //break;
                   found = true;
                   cnt++;
                }
            }
            if(found)
            {
                match.push([file,cnt]);
                found = false;
                cnt = 0;
            }
        }
    }
    return match;

}


//sort based on second column
function sortByCount(data1,data2)
{
    if(data1[1]===data2[1])
        return 0;
    else
        return (data1[1]>data2[1])? -1 : 1;
    
}

//display file name as link header and index terms as body
document.getElementById("searchbtn").addEventListener('click',function(){
    event.preventDefault();
    //alert("here");
    document.getElementsByClassName("retrievedContents")[0].style.display="block";
    document.getElementById("retrievedDocuments").innerHTML="";
    var query = document.getElementById("searchquery").value;
    var file = retrieve(query);
    if(file.length==0)
    {
        var li = document.createElement("li");
        li.classList.add("list-group-item","m-2");
        var text = document.createTextNode("No result found!")
        li.appendChild(text);
        document.getElementById("retrievedDocuments").appendChild(li);

    }
    else
    {
        file.sort(sortByCount);
        for(var i=0; i<file.length; i++)
        {
            var li = document.createElement("li");
            li.classList.add("list-group-item","m-2");
            var link = document.createElement("a")
            link.href = "#";
            link.classList.add("retrievedLink");
    
            var text = document.createTextNode(file[i][0].filename);
            link.appendChild(text);
            li.appendChild(link);
    
            var p = document.createElement("p");
            text = document.createTextNode(file[i][0].index.join(" "));
            p.appendChild(text);
            li.appendChild(p);
    
            document.getElementById("retrievedDocuments").appendChild(li);
        }
    }

});