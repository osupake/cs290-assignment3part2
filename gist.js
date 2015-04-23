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

/*
function showGists(gist) { //create ordered list
	var resultsList = '<ol id="list">';
	var languages = setFilteredLanguages();
	//console.log(languages);

	for(var i=0; i < gist.length; i++) {
		if(languages.indexOf(gist[i].language) >= 0) { //skip if language is filtered
			continue;
		}
		if(gist[i].description === null || gist[i].description.length === 0) { //blank descriptions changes to 'No Description'
			gist[i].description = 'No Description';
		}
		resultsList += '<li>';
		resultsList += '<a href="' + gist[i].url + '">' + gist[i].description + '</a>';

		var button = document.createElement('button');
   	 	var buttonTxt = document.createTextNode('+');
   		button.setAttribute('onclick', saveFavorite());
   		button.appendChild(buttonTxt);
   		var li = document.createElement('div');
   		li.appendChild(button);

		var list = document.getElementById('list');
		var button = document.createElement('button');
		button.type = 'button';
		button.appendChild(document.createTextNode('+'));
		list.appendChild(button);
		resultsList += '</li>';

	}

	resultsList += '</ol>';
	
	document.getElementById('results').innerHTML = resultsList;
}
*/

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

		var button = document.createElement('button');
		button.type = 'button';
		button.appendChild(document.createTextNode('+'));
		button.setAttribute('onclick', saveFavorite(gist[i].url, gist[i].description));
		list.appendChild(button);
	}
}

function saveFavorite(url, description) {
	var a = {favorites: [url, description]};
	//console.log(gist.description);
	localStorage.setItem('session', JSON.stringify(a));
}
