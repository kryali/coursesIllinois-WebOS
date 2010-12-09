/**
*	This page was a sandbox to try various parse methods
*	- not used, should be deleted soon
*/

function ParsePageAssistant(url, title) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	  // this.id = argFromPusher
	  this.url = url + title;;
	  Mojo.Log.info(this.url);

}

ParsePageAssistant.prototype.setup = function() {
	
	Mojo.Log.info("==============AJAX REQUEST==============="); 
	var request = new Ajax.Request(this.url, {
		method: "get",
		evalJSON: "false",
		onLoaded : function(response){
			Mojo.Log.info("Loaded Request");
		},
		onSuccess: function(response){
			Mojo.Log.info("Success Request");
		},
		onComplete: this.parseIt.bind(this),
		onFailure: function(response){
			Mojo.Log.info("Failed Request");
		}
	});
	
	this.buttonModel = { "label" : "Refresh", "buttonClass" : "", "disabled" : false };
	this.controller.setupWidget("MyButton", this.buttonAttributes, this.buttonModel);
	Mojo.Event.listen(this.controller.get("MyButton"), Mojo.Event.tap, this.handleButtonPress.bind(this));
	this.testFunction("apple","banana");
	
	//this.controller.get("main").update("<p>I'm here</p>");
	//this.controller.get("main").update(test);
	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */

};


ParsePageAssistant.prototype.testFunction = function(arg1,arg2){
	Mojo.Log.info(arg1+arg2);
}


ParsePageAssistant.prototype.parseIt = function(response) {


	function classObject(){
		this.crn = -1;
		this.type = -1;
		this.section = -1;
		this.time = -1;
		this.days = -1;
		this.location = -1;
		this.instructor = -1;
		this.notes = -1;
	}
	var notGoingInDom =  this.controller.get(document).createElement('div'); 
 	notGoingInDom.innerHTML = response.responseText;
	this.controller.get("main").update(notGoingInDom);
	var oTable = notGoingInDom.getElementsByTagName("table");
	oTable = oTable[0];
	myrows =oTable.rows;
	var sections = new Array();
	
	//courseDescription = notGoingInDom.getElementById("ws-cis");
	//courseDescription = courseDescription.getElementsByClassName("ws-description");
	Mojo.Log.info(courseDescription);
	
	for( var i = 1; i < myrows.length; i++){
		currentRow = myrows[i].getElementsByClassName("ws-row");
		var currentSection = new classObject();
		for( var j = 0; j < currentRow.length; j++){
			currentAttribute = currentRow[j].getAttribute("headers");
			currentText = currentRow[j].innerHTML;
			if( currentAttribute == "ws-crn")
				currentSection.crn = currentText.match(/\d\d\d\d\d/g);
			else if( currentAttribute == "ws-type")
				currentSection.type = currentText.match(/[a-z]+/i);
			else if( currentAttribute == "ws-section")
				currentSection.section = currentText.match(/[A-Z0-9]+/i);
			else if( currentAttribute == "ws-time")
				currentSection.time = currentText.match(/\d\d:\d\d.(PM|AM)/gi);
			else if( currentAttribute == "ws-days")
				currentSection.days = currentText.match(/[A-Z]/g);
			else if( currentAttribute == "ws-location"){
				currentSection.location = currentText.match(/[a-zA-Z0-9\s(<br>)(&nbsp;)]+/g);
			}
			else if( currentAttribute == "ws-instructor"){
				currentSection.instructor = currentText.match(/[a-zA-Z]+,.[a-zA-Z]+/g);
			}
		}
		if(currentRow.length !=0 ){
			sections.push(currentSection);
		}
		
	}	
	
	var output = "";
	for(var i=0; i<sections.length;i++){
		output += "CRN:  " + sections[i].crn + "<br />";
		output += "TYPE: " + sections[i].type + "<br />";
		output += "TIME: " + sections[i].time + "<br />";
		output += "DAYS: " + sections[i].days + "<br />";
		output += "LOCATION: " + sections[i].location + "<br />";
		output += "PROFESSOR: <a href=\"\"> " + sections[i].instructor + "</a><br /><br />";
		//output += "DES : " + courseDescription;
	}
	this.controller.get("main").update(output);
	Mojo.Log.info("Finished Parsing");
}



ParsePageAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

ParsePageAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

ParsePageAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
