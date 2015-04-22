function startGists() {
	var pages = 1;
	var pageNum = document.getElementsByName('pages')[0].value;
	var results = [];

	for(var i=1; i <= pageNum; i++) {
		var url = 'https://api.github.com/gists?page=' + pages + '&per_page=30';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
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
		xhr.open('GET', url);
		xhr.send();
		pages++
	}
}

function showGists(array) {
	var resultsList = '<ol>';
	for(var i=0; i < array.length; i++) {
		resultsList += '<li>';
		resultsList += array[i];
		resultsList += '</li>';
	}
	resultsList += '</ol>';
	document.getElementById('results').innerHTML = resultsList;
}