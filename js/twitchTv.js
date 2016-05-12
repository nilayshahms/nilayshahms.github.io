var twitchTv = (function(){

	var recordsPerPage = 10;
	document.getElementById("btn_search").onclick = function(){
		search();
	}

	var search = function(){
		var query = document.getElementById('searchQuery').value;
		var url = 'https://api.twitch.tv/kraken/search/streams?q='+query+'&callback=twitchTv.createList';
		loadData(url);
	}

	var loadData = function(url) {
		var headElem = document.getElementsByTagName('head')[0];
		var scriptElem = document.createElement('script');
		scriptElem.setAttribute('src',url);
		scriptElem.setAttribute('id',"jsonp-script");
		headElem.appendChild(scriptElem);
	}


	var createList = function(reponseObj){
		var parent = document.getElementById("mainContent");
		parent.innerHTML = '';
		document.getElementById("totalCount").innerHTML = "Total: "+ reponseObj._total;
		populatePagination(reponseObj);

		for(var i=0;i<reponseObj.streams.length;i++){
			 
			var template = document.querySelector('#template');
			// Populate the src at runtime.
			template.content.querySelector('img').src = reponseObj.streams[i].preview.template.replace("{width}", "700").replace("{height}", "300");
			template.content.querySelector('h1').textContent = reponseObj.streams[i].game;
			template.content.querySelector('h4').textContent = reponseObj.streams[i].game+' - '+reponseObj.streams[i].viewers + ' viewers';
			template.content.querySelector('#details').href = reponseObj.streams[i]._links.self;
			var clone = document.importNode(template.content, true);
			parent.appendChild(clone);
		}

		var jsonpScript = document.getElementById("jsonp-script");
		jsonpScript.parentNode.removeChild(jsonpScript);
	}

	var populatePagination = function(reponseObj){
		var totalPages = Math.ceil(reponseObj._total/recordsPerPage);

		var offset = getParamValuesByName(reponseObj._links.self,"offset");
		var currentPage = Math.floor(offset/recordsPerPage)+1;

		if(currentPage === totalPages){
			document.getElementById("next").style.display = "none";
		}else{
			document.getElementById("next").style.display = "block";
		}

		if(offset-10 < 0){
				document.getElementById("prev").style.display = "none";
		}else{
			document.getElementById("prev").style.display = "block";
		}

		document.getElementById("current").innerHTML = currentPage+"/"+totalPages;
		document.getElementById("next").onclick = function(){
			loadData(reponseObj._links.next+'&callback=twitchTv.createList');
		}
		document.getElementById("prev").onclick = function(){
			var prevUrl = reponseObj._links.self.replace("offset="+offset,"offset="+(offset-10));
			loadData(prevUrl+'&callback=twitchTv.createList');
		}
	}

	var getParamValuesByName = function(url,querystring) {
	  var qstring = url.slice(url.indexOf('?') + 1).split('&');
	  for (var i = 0; i < qstring.length; i++) {
	    var urlparam = qstring[i].split('=');
	    if (urlparam[0] == querystring) {
	       return urlparam[1];
	    }
	  }
	}

	return {
		createList:createList,
		getParamValuesByName:getParamValuesByName,
		populatePagination:populatePagination,
		loadData:loadData,
		search:search
	}
})();

