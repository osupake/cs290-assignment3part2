var faves = [];

function gist(description, url, language) {
	this.description = description;
	this.url = url;
	this.language = language;
}

function startGists() {
	var pages = 1;
	var pageNum = document.getElementsByName('pages')[0].value;
	var results = [];

	for(var i=1; i <= pageNum; i++) {
		var url = 'https://api.github.com/gists?page=' + pages + '&per_page=30';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () { //callback function
			if(this.readyState === 4 && this.status === 200) {
				var response = JSON.parse(this.responseText);
				//console.log(typeof response);
				//console.log(response);
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
					results.push(newGist);
				}
			}
			showGists(results);
		}
		xhr.open('GET', url);
		xhr.send();
		pages++
	}
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
	var list = document.getElementById('list');
	var languages = setFilteredLanguages();

	for(var i=0; i < gist.length; i++) {
		if(languages.indexOf(gist[i].language) >= 0) { //skip if language is filtered
			continue;
		}
		if(gist[i].description === null || gist[i].description.length === 0) { //blank descriptions changes to 'No Description'
			gist[i].description = 'No Description';
		}
		var entry = document.createElement('li');
		var link = document.createElement('a');
		link.appendChild(document.createTextNode(gist[i].description));
		link.href = gist[i].url;
		entry.appendChild(link);
		list.appendChild(entry);
/*
		var addFave = document.createElement('button');
		addFave.type = 'button';
		addFave.name = '<a href="' + link.href + '>' + gist[i].description + '</a>';
		addFave.appendChild(document.createTextNode('+'));
		addFave.onclick = function() {
			saveFavorite(this.name);
		}
		list.appendChild(addFave);
*/
		var addFave = document.createElement('button');
		addFave.type = 'button';
		addFave.name = link.href
		addFave.value =  gist[i].description;
		addFave.appendChild(document.createTextNode('+'));
		addFave.onclick = function() {
			saveFavorite(this.name, this.value);
		}
		list.appendChild(addFave);
		
	}

}

function faveItem(url, description) {
	this.url = url;
	this.description = description;
}

function saveFavorite(url, description) {
	//console.log(link);
	var newFave = new faveItem(url, description);
	//faves.push(newGist);
	faves.push(newFave);
	localStorage.setItem('favorites', JSON.stringify(faves));
}

function listFavorites(faveArray) {
	var list = document.getElementById('favoriteList');
	for(var i=0; i < faveArray.length; i++) {
		var entry = document.createElement('li');
		console.log(faveArray[i]);
		var link = document.createElement('a');
		link.appendChild(document.createTextNode(faveArray[i].description));
		link.href = faveArray[i].url;
		entry.appendChild(link);
		list.appendChild(entry);

		var rmFave = document.createElement('button');
		rmFave.type = 'button';
		rmFave.appendChild(document.createTextNode('-'));
		rmFave.onclick = function() {
			console.log(faveArray);
			//this.parentNode.removeChild(entry);
			//this.parentNode.removeChild(this);
	}
	list.appendChild(rmFave);
	}
}

window.onload = function() {
	var faveArray= JSON.parse(localStorage.getItem('favorites'));
	listFavorites(faveArray);
	//document.getElementById('displayFavorites').innerHTML = faveArray[i];
}