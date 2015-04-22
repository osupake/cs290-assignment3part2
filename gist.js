function gists(){
	var xhr = new XMLHttpRequest();
	var url = 'https://api.github.com/gists';
	var pageNum = document.getElementsByName('pages')[0].value;

	console.log(url);
	console.log(pageNum);

	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);
			console.log(typeof response);
		}
	}

	xhr.open('GET', url);
	xhr.send();
}