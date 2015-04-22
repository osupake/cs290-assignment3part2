var results = [];

function startGists() {
	var pages = 1;
	var pageNum = document.getElementsByName('pages')[0].value;

	for(var i=1; i <= pageNum; i++) {
		var url = 'https://api.github.com/gists?page=' + pages + '&per_page=30';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = getGists;
		xhr.open('GET', url);
		xhr.send();
		pages++
	}
}

function getGists() {
	if(this.readyState === 4 && this.status === 200) {
		var response = JSON.parse(this.responseText);
		//console.log(typeof response);
		//console.log(response);
		for (var i=0; i < response.length; i++) {
			results.push(' <a href="' + response[i].html_url + '">' + response[i].description + '</a>');
		}
	}
	showGists(results);
}

function showGists(array) {
	var showResults = '<ol>';
	for(var i=0; i < array.length; i++) {
		showResults += '<li>';
		showResults += array[i];
		showResults += '</li>';
	}
	showResults += '</ol>';
	document.getElementById('results').innerHTML = showResults;
}