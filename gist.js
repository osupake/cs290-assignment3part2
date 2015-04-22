function gists(){
	var pageNum = document.getElementsByName('pages')[0].value;
	var totalPages = pageNum * 30;
	var xhr = new XMLHttpRequest();
	var url = 'https://api.github.com/gists?per_page=' + totalPages;
	
	console.log(totalPages);

	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);
			console.log(typeof response);
			console.log(response);
			showGists(response);
		}
	}

	xhr.open('GET', url);
	xhr.send();
}

function showGists(response) {
	var showResults = '<ol>';
	for(var i=0; i < response.length; i++) {
		showResults += '<li>' + ' <a href="' +response[i].html_url + '">';
		showResults += response[i].description + '</a>';
		showResults += '</li>';
	}
	showResults += '</ol>';
	document.getElementById('results').innerHTML = showResults;
}