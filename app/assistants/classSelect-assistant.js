/*
* classSelect-Assistant
*	main roles: build the list of classes offered of a given subject
*		method: send a http request to catalog and parse response to get class list
*	exit role : pass the class to the sectionSelect-Assistant

	IMPORTANT NOTE! - This function is a branch of subjectSelect
					+ thus uses the same methods and similar functions
						- main difference in line 110
	TODO: figure out how to merge subjectSelect and classSelect
*/


/**
* ClassSelectAssistant(argument) 
*	#argument - current semester
*	: this function receives the current semester from the previous scene.
*	  generates a url based on the previous semester
*	 - e.x:  this.url =  "http://courses.illinois.edu/cis/2010/fall/schedule/" + "CS"
**/
function ClassSelectAssistant(url, subject, calendarId ) {
	this.url = url + subject;
	this.subject = subject;	
	this.calendarId = calendarId;
	
}

/**
 *     searchList - filter function called from search field widget to update the 
 *  results list. This function will build results list by matching the 
 *    filterstring to the classTitles, and then return the subset 
 *    of the list that corresponds to the offset and size requested by the widget. 
 */
ClassSelectAssistant.prototype.searchList =  function(filterString, listWidget, offset, count){

	// If there is no filterString, the header should be displayed
	if(filterString == ""){
		Mojo.Log.info("Printing entire list");
		$("header").show();
	}
	// Remove the header if the user is using search
	else{
		Mojo.Log.info("Not printing entire list");
		$("header").hide();
	}
	// Array to hold all the items that match the filterString
	var items = [];
	
	Mojo.Log.info("Offset:%d", offset );
	
	if(!this.classArray){
		return;
	}
	// Iterate throughout the subject data structure and populate items with 
	
	// BUGFIX: Start from the offest, otherwise you get looping list
	for( var i = offset; i < this.classArray.length; i++){
		
		// If there is no search string, display all the lists
		if(filterString == ""){
			items.push({title: this.classArray[i].code, description: this.classArray[i].title});
		}
		else{
		// There is a search string, now check for its existence in the current row
			if(this.classArray[i].title.indexOf(filterString)!=-1 || this.classArray[i].code.indexOf(filterString) != -1 )
				items.push({title: this.classArray[i].code, description: this.classArray[i].title});
		}
			
	}
	Mojo.Log.info("Finished");
		
	//update list with new items
	listWidget.mojo.noticeUpdatedItems(offset, items);
}



/**
* setup function - 
*	main role: initiates the ajax request and initializes the list Widget "MyList"
*/
ClassSelectAssistant.prototype.setup = function() {
	
	Mojo.Log.info("setup");
	// Populate the fixed header with the current subject
	this.controller.get("header").update(this.subject + ": Pick a class");
  	
	// initialize the ajax request and bind the parse function to the success pathway
	var request = new Ajax.Request(this.url, {
		method: "get",
		evalJSON: "false",
		onLoaded : function(response){
			Mojo.Log.info("Loaded Request");
		},
		onSuccess: function(response){
			Mojo.Log.info("Success Request");
		},
		onComplete: this.loadList.bind(this),
		onFailure: function(response){
			Mojo.Log.info("Failed Request");
		}
	});
  
	// HACK: create an empty line to create space for the fixed header 
	this.myListModel = { items : [{title : " ", description : " "	}] };
  	
	// declare the list attributes
	this.myListAttr = {
		listTemplate: "subjectSelect/listTemplate",
		itemTemplate: "subjectSelect/itemTemplate",
		filterFunction: this.searchList.bind(this),
		renderLimit: 20
	};
	
	// set up the list model with declared attribute
	this.controller.setupWidget("MyList",this.myListAttr,this.myListModel);
	
	// bind to the listTap event to the listTap function
	this.controller.listen(this.controller.get("MyList"), Mojo.Event.listTap, this.listTap.bind(this));

};

/**
*	loadList(transport) - called upon the success pathway of the ajax request
				main role: parse through resulting request and populate the list widget
				with the resulting subjects.
				side role: build an object array of subjects (future data manipulation) 
*/
ClassSelectAssistant.prototype.loadList = function(transport) {

	Mojo.Log.info("Initiate Parsing");
	try{
		// notGoingInDom:  temporary div that contains the ajax response
		//	   main role:	enable use of javascript DOM manipulation
		var notGoingInDom =  this.controller.get(document).createElement('div'); 
		notGoingInDom.innerHTML = transport.responseText;
	} catch(e){
		// error out if the request fails
		Mojo.Log.error(e);
	}

	function subjObject(){
		this.code = "";
		this.title =""; 
	}
	
	Mojo.Log.info("Starting Parsing");
	// descList =  all the class descriptions (all the elements in response wrapped in tag class="ws-course-title")
	var descList = notGoingInDom.getElementsByClassName('ws-course-title');
	// numList =  all the class numbers (all the elements in response wrapped in tag class="ws-course-title")
	var numList = notGoingInDom.getElementsByClassName('ws-course-number');
	
	// classArray  : object that contains all the subject objects 
	this.classArray = new Array();

	for( var i =0; i<descList.length; i++){
	
		currentSubj = new subjObject();
		// description is wrapped around a link tag, so pick out the link and read the innerHTML
		currentSubj.title = (descList[i].getElementsByTagName("a"))[0].innerHTML;
		// Use a regular expression to pick out just the course number
		currentSubj.code = numList[i].innerHTML.match(/[0-9]+/g);
		Mojo.Log.info(currentSubj.code + ":" + currentSubj.title);	// For DEBUG
		
		// Push the current class to the list and add the data
		this.myListModel.items.push({title: currentSubj.code, description: currentSubj.title});
		this.classArray[i] = currentSubj;
	}
	Mojo.Log.info("Finishing Parsing");
	
	// update the list model with the new list information
	this.controller.modelChanged(this.myListModel);
};


/**
*	listTap(event)  - this function is called on a the event of a listTap
*   			main role : takes a list item (class number) and passes 
*				      		the class number to the sectionSelect scene		
**/
ClassSelectAssistant.prototype.listTap = function(event) {
	//Mojo.Log.info(event.item.title);
	this.title = event.item.title;
	this.controller.stageController.pushScene("sectionSelect", this.url, this.title, this.subject, this.calendarId);
};


ClassSelectAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

ClassSelectAssistant.prototype.deactivate = function(event) {
	//TODO: Stop listening on widgets
};

ClassSelectAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
	 
};
