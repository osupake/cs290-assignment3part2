function gist(description, url, language) {
	this.description = description;
	this.url = url;
	this.language = language;
}

function faveItem(url, description) {
	this.url = url;
	this.description = description;
}

function startGists() {
	document.getElementById('list').innerHTML = ""; //clear list on subsequent searches
	var pages = 1;
	var pageNum = document.getElementsByName('pages')[0].value;

	for(var i=1; i <= pageNum; i++) {
		var url = 'https://api.github.com/gists?page=' + pages + '&per_page=30';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () { //callback function
			if(this.readyState === 4 && this.status === 200) {
				var response = JSON.parse(this.responseText);
				//console.log(typeof response);
				//console.log(response);
				addToArray(response);
			}	
		}

		xhr.open('GET', url);
		xhr.send();
		pages++
	}
}

function addToArray(response) {
	var results = [];
	for (var i=0; i < response.length; i++) {
		var description = response[i].description;
		var url = response[i].html_url;
		var language;
		for(var property in response[i].files) {
			var filesObject = response[i].files[property];
			language = filesObject.language;
			//console.log(language);
		}
		var newGist = new gist(description, url, language);
		results.push(newGist); //array with all gists
		//console.log(results.length);
	}
	showGists(results);
}


function setFilteredLanguages() { //create array of filtered languages
	var filteredLanguages = [];
	if(document.getElementById('Python').checked) {
		filteredLanguages.push('Python');
	}
	if(document.getElementById('JSON').checked) {
		filteredLanguages.push('JSON');
	}
	if(document.getElementById('JavaScript').checked) {
		filteredLanguages.push('JavaScript');
	}
	if(document.getElementById('SQL').checked) {
		filteredLanguages.push('SQL');
	}
	return filteredLanguages;
}

function showGists(gist) { //create ordered list
	var languages = setFilteredLanguages();

	for(var i=0; i < gist.length; i++) {
		if(languages.indexOf(gist[i].language) >= 0) { //skip if language is filtered
			continue;
		}
		if(gist[i].description === null || gist[i].description.length === 0) { //blank descriptions changes to 'No Description'
			gist[i].description = 'No Description';
		}
		var list = document.getElementById('list');
		var entry = document.createElement('li');
		var link = document.createElement('a');
		link.appendChild(document.createTextNode(gist[i].description));
		link.href = gist[i].url;
		entry.appendChild(link);
		list.appendChild(entry);

		var addFave = document.createElement('button'); //add favorite button
		addFave.type = 'button';
		addFave.name = link.href
		addFave.value =  gist[i].description;
		addFave.appendChild(document.createTextNode('+'));
		addFave.onclick = function() {
			saveFavorite(this.name, this.value);
			var resultLi = this.previousSibling;
			resultLi.parentNode.removeChild(resultLi);
			this.parentNode.removeChild(this);
		}
		list.appendChild(addFave);	
	}

}

function saveFavorite(url, description) {
	var storedFavorites = localStorage.getItem('favorites'); //get favorites from local storage
    var favorites;
    var favesArray = [];
    if (storedFavorites === null) {
        favesArray = [];
    } else {
        favorites = JSON.parse(storedFavorites);
        for(var i=0; i < favorites.length; i++) {
        	favesArray[i] = favorites[i]; //add to temp array
        }
    }
	var newFave = new faveItem(url, description);
	favesArray.push(newFave);
	localStorage.setItem('favorites', JSON.stringify(favesArray));
	buildFavoriteList(newFave);
}


function buildFavoriteList(item) {
	var list = document.getElementById('favoriteList');
	var entry = document.createElement('li');
	var link = document.createElement('a');
	link.appendChild(document.createTextNode(item.description));
	link.href = item.url;
	entry.appendChild(link);
	list.appendChild(entry);

	var rmFave = document.createElement('button'); //remove favorite button
	rmFave.type = 'button';
	rmFave.appendChild(document.createTextNode('-'));
	rmFave.onclick = function() {
		//console.log(item);
		this.parentNode.removeChild(entry);
		this.parentNode.removeChild(this);

		var json = JSON.parse(localStorage["favorites"]);
		for (var i=0; i<json.length; i++) {
            if (json[i].url == item.url) { //delete if url matches
            	json.splice(i,1);
        	}
        }
		localStorage["favorites"] = JSON.stringify(json);
	}
	list.appendChild(rmFave);
}

function listFavorites() {
	var storedFavorites = localStorage.getItem('favorites');
    var favorites;

    if (storedFavorites === null) {
        favorites = {};
    } else {
        favorites = JSON.parse(storedFavorites);
        for(var i=0; i < favorites.length; i++) {
        	buildFavoriteList(favorites[i]);
        }
    }
}

function clearFavorites() {
	localStorage.clear();
	document.getElementById('favoriteList').innerHTML = "";
}

window.onload = function() {
	listFavorites();
}