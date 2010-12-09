/*
* subjectSelect-Assistant
*	main roles: use input semester to build list of subjects
*		method: send a http request to catalog and parse response to get subjectlist
*	exit role : pass the subject to the classSelect-Assistant

*/

/**
* SubjectSelectAssistant(argument) 
*	#argument - current semester
*	: this function receives the current semester from the previous scene.
*	  generates a url based on the previous semester
*	 - e.x:  this.semester = "2010/fall/"
*			 "http://courses.illinois.edu/cis/" + this.semester + "schedule/
**/
function SubjectSelectAssistant(argument, calendarId) {
	   this.semester = argument;
	   this.url = "http://courses.illinois.edu/cis/" + this.semester + "schedule/";
	this.calendarId = calendarId;
	Mojo.Log.info("subjectSelect: %d", this.calendarId);
}

/**
 *     searchList - filter function called from search field widget to update the 
 *  results list. This function will build results list by matching the 
 *    filterstring to the classTitles, and then return the subset 
 *    of the list that corresponds to the offset and size requested by the widget. 
 */
SubjectSelectAssistant.prototype.searchList =  function(filterString, listWidget, offset, count){

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
	
			
	if(!this.subjArray){
		//Mojo.Log.error("Didn't get it yet!");
		return;
	}
	// Iterate throughout the subject data structure and populate items with 
	for( var i = offset; i < this.subjArray.length; i++){
		if(filterString == ""){
			items.push({title: this.subjArray[i].code, description: this.subjArray[i].title});
		}
		else{
		// There is a search string, now check for its existence in the current row
			if(this.subjArray[i].title.toLowerCase().indexOf(filterString.toLowerCase())!=-1 || this.subjArray[i].code.toLowerCase().indexOf(filterString.toLowerCase()) != -1 )
				items.push({title: this.subjArray[i].code, description: this.subjArray[i].title});
				
			// FilterList tests
			if(filterString == "CS")
				Mojo.Log.info(this.subjArray[i].code == "CS");
			else if(filterString == "ABE")
				Mojo.Log.info(this.subjArray[i].code == "ABE");
			else if(filterString == "ACES")
				Mojo.Log.info(this.subjArray[i].code == "ACES");
		}	
	}
	listWidget.mojo.noticeUpdatedItems(offset, items);
}

/**
* setup function - 
*	main role: initiates the ajax request and initializes the list Widget "MyList"
*/
SubjectSelectAssistant.prototype.setup = function() {

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
		// on a successful Ajax Request, bind the response to loadList() - parser
		onComplete: this.loadList.bind(this),
		onFailure: function(response){
			Mojo.Log.info("Failed Request");
		}
	});
	
  	// HACK: create an empty line to create space for the fixed header 
	this.myListModel = { items : [{title : " ", description : " "	}],
						 disabled: false };
  
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
SubjectSelectAssistant.prototype.loadList = function(transport){

	Mojo.Log.info("Initiate Parsing");
	
	// notGoingInDom:  temporary div that contains the ajax response
	//	   main role:	enable use of javascript DOM manipulation
	var notGoingInDom =  this.controller.get(document).createElement('div'); 
 	notGoingInDom.innerHTML = transport.responseText;

	
	try{
		// codeList =  all the course descriptions (all the elements in response wrapped in tag class="ws-course-title")
		var codeList = notGoingInDom.getElementsByClassName('ws-course-title');
		// descList =  all the course titles (all the elements in response wrapped in tag class="ws-course-title")
		var descList = notGoingInDom.getElementsByClassName('ws-course-number');
	} catch(e){
		// If there was an error thrown here then 
		// the received response may be incorrect
		Mojo.Log.error(e);
	}
	
	// subjObject : object that contains the subject code and description
	function subjObject(){
		this.code = "";
		this.title =""; 
	}
	// subjArray  : object that contains all the subject objects 
	this.subjArray = new Array();

	// iterate through the collections of subject codes and descriptions
	for( var i =0; i<codeList.length; i++){
		// Create a new subject to pass push to subjectArray 
		currentSubj = new subjObject();
		currentSubj.title = (codeList[i].getElementsByTagName("a"))[0].innerHTML;
		currentSubj.code = descList[i].innerHTML;
		//DEBUG: Mojo.Log.info(currentSubj.title + ":" + currentSubj.code);
		
		// Add the current subject attributes to a list item
		this.myListModel.items.push({title: currentSubj.code, description: currentSubj.title});
		
		// push the current subject into the array
		this.subjArray[i] = currentSubj;
	}
	Mojo.Log.info("Finishing Parsing");
	Mojo.Log.info("Mojo Log Info: " + this.subjArray.length);
	// update the list widget with the new model
	this.controller.modelChanged(this.myListModel);									

}

/**
*	listTap(event)  - this function is called on a the event of a listTap
*   				: takes a list item (course subject) and passes 
*						the subject to the classSelect scene		
**/
SubjectSelectAssistant.prototype.listTap = function(event) {
	// access the title of the list item
	this.title = event.item.title;
	// pass the current url and the selected subject to the classSelect scene
	this.controller.stageController.pushScene("classSelect", this.url, this.title, this.calendarId);
};

/**
* Unused function prototypes
**/
SubjectSelectAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

SubjectSelectAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

SubjectSelectAssistant.prototype.cleanup = function(event) {
	//TODO: stop listening on widgets
};

SubjectSelectAssistant.prototype.handleButtonPress = function(event){
};
