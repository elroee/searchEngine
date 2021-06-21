//global variables for inter-functions communication
var data, numWords, lexicalAnalysedData, stopwordRemovedData,extremeRemovedData, stemmedData, filename;

//lexical analyser
function lexicalAnalyser(file) {
    var token = splitSeparators(file);
    var freqData = getFrequency(token);
    return freqData;
}

//splits string into array by removing separators and numbers
function splitSeparators(data) {
    const delims = ['.', '!', '.', '?', ',', '(', ')', '\t', '\n', '\r', ' ', '[', ']', '{', '}', '\\', ':', ';', '-'];
    //const numbers=['0','1','2','3','4','5','6','7','8','9'];
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
//removes extreme frequency words
function removeExtremeFreq(data){
    var totWords = lexicalAnalysedData.length;
    var totFreq=0;
    for(var i=0; i<totWords; i++)
        totFreq+=lexicalAnalysedData[i][1];
    var minTreshold = 0.005*totFreq, maxTreshold = 0.8*totFreq;
    var extremeRemoved= [];
    for(var i=0; i<data.length; i++)
    {
        if(data[i][1]>minTreshold && data[i][1]<maxTreshold)
            extremeRemoved.push([data[i][0],data[i][1]]);
    }
    return extremeRemoved;
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

//removes prefixes and suffixes and clusters words with the same root
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

//function to store index, creates an object with three key-value pairs and stores in local storage with timestamp
function storeIndex(data) {
    var indexString = [];
    for (var i = 0; i < data.length; i++) {
        indexString.push(data[i][0]);
    }
    var obj = {
        filename: filename,
        index: indexString,
        link: ""
    }
    window.localStorage.setItem("file" + Date.now().toString(), JSON.stringify(obj));
}

//reads fine input as string; converts text file to string
function readFileAsString() {
    var files = this.files;
    if (files.length === 0) {
        alert('No file is selected');
        return;
    }

    var reader = new FileReader();
    reader.onload = function (event) {
        //console.log('File content:', event.target.result);
        data = event.target.result;
    };
    reader.readAsText(files[0]);
}

document.getElementById('documentFile').addEventListener('change', readFileAsString);

document.getElementById("lexicalAnalysisPage").addEventListener('click', function () {
    event.preventDefault();
    document.getElementById("addDoc-tab").classList.remove('active');
    document.getElementById("lexical-tab").classList.add('active');
    document.getElementById("addDoc").classList.remove('active');
    document.getElementById("lexicalAnalysis").classList.add('active');

    filename = document.getElementById("documentTitle").value;
    var file = data;
    lexicalAnalysedData = lexicalAnalyser(file);

    var table = document.getElementById("lexicalAnalysedData");
    for (var i = 0; i < lexicalAnalysedData.length; i++) {
        //alert("here");
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        cell1.innerHTML = i + 1;
        cell2.innerHTML = lexicalAnalysedData[i][0];
        cell3.innerHTML = lexicalAnalysedData[i][1];
    }
    numWords = lexicalAnalysedData.length;
    document.getElementById("numWordsLA").innerHTML = numWords;

});

document.getElementById("stopwordRemovalPage").addEventListener('click', function () {
    event.preventDefault();
    stopwordRemovedData = removeStopwords(lexicalAnalysedData);

    document.getElementById("lexical-tab").classList.remove('active');
    document.getElementById("stopword-tab").classList.add('active');
    document.getElementById("lexicalAnalysis").classList.remove('active');
    document.getElementById("stopwordRemoval").classList.add('active');

    var table = document.getElementById("stopwordRemovedData");
    for (var i = 0; i < stopwordRemovedData.length; i++) {
        //alert("here");
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        cell1.innerHTML = i + 1;
        cell2.innerHTML = stopwordRemovedData[i][0];
        cell3.innerHTML = stopwordRemovedData[i][1];
    }
    document.getElementById("numWordsSR").innerHTML = stopwordRemovedData.length;
    document.getElementById("numWordsRemovedSR").innerHTML = numWords - stopwordRemovedData.length;
    numWords = stopwordRemovedData.length;
});

document.getElementById("extremePage").addEventListener('click',function(){
    event.preventDefault();
    document.getElementById("extreme-tab").classList.add('active');
    document.getElementById("stemming-tab").classList.remove('active');
    document.getElementById("extremeRemoval").classList.add('active');
    document.getElementById("stemming").classList.remove('active');

    extremeRemovedData = removeExtremeFreq(stemmedData);
    var table = document.getElementById("extremeRemovedData");
    for (var i = 0; i < extremeRemovedData.length; i++) {
        //alert("here");
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        cell1.innerHTML = i + 1;
        cell2.innerHTML = extremeRemovedData[i][0];
        cell3.innerHTML = extremeRemovedData[i][1];
    }
    document.getElementById("numWordsER").innerHTML = extremeRemovedData.length;
    document.getElementById("numWordsRemovedER").innerHTML = stemmedData.length-extremeRemovedData.length;
});

document.getElementById("stemmingPage").addEventListener('click', function () {
    event.preventDefault();
    stemmedData = stemmer(stopwordRemovedData);
    //stemmedData = stopwordRemovedData;
    document.getElementById("stemming-tab").classList.add('active');
    document.getElementById("stopword-tab").classList.remove('active');
    document.getElementById("stemming").classList.add('active');
    document.getElementById("stopwordRemoval").classList.remove('active');

    var table = document.getElementById("stemmedData");
    for (var i = 0; i < stemmedData.length; i++) {
        //alert("here");
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        cell1.innerHTML = i + 1;
        cell2.innerHTML = stemmedData[i][0];
        cell3.innerHTML = stemmedData[i][1];
    }
    document.getElementById("numWordsST").innerHTML = stemmedData.length;
    document.getElementById("numWordsRemovedST").innerHTML = stopwordRemovedData.length-stemmedData.length;
});

document.getElementById("weightingPage").addEventListener('click', function () {
    event.preventDefault();
    var tmpArray = [];
    for (var i = 0; i < extremeRemovedData.length; i++)
        tmpArray.push(extremeRemovedData[i][0]);
    var table = document.getElementById("weightedData");
    for (var i = 0; i < extremeRemovedData.length; i++) {
        //alert("here");
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = i + 1;
        cell2.innerHTML = extremeRemovedData[i][0];
        cell3.innerHTML = 1;
    }
    document.getElementById("numWords0").innerHTML = lexicalAnalysedData.length - extremeRemovedData.length;
    document.getElementById("numWords1").innerHTML = extremeRemovedData.length;
    document.getElementById("weighting-tab").classList.add('active');
    document.getElementById("extreme-tab").classList.remove('active');
    document.getElementById("weighting").classList.add('active');
    document.getElementById("extremeRemoval").classList.remove('active');
});

document.getElementById("finishPage").addEventListener('click', function () {
    event.preventDefault();
    storeIndex(extremeRemovedData);
    document.getElementById("finish-tab").classList.add('active');
    document.getElementById("weighting-tab").classList.remove('active');
    document.getElementById("finish").classList.add('active');
    document.getElementById("weighting").classList.remove('active');
});

