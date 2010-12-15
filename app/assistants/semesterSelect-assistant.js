function SemesterSelectAssistant(calendarId) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	  this.calendarId = calendarId;
	  
	Mojo.Log.info("Semester: %s", this.calendarId);
}

/**
*	setup semester button widgets
**/
SemesterSelectAssistant.prototype.setup = function() {

	// NOTE: Couldn't find an elegant way for two buttons to use the same function
	//		- experimented with event.target.id, but documentation was scarce
	
	this.buttonModel1 = { "label" : "Spring 2011", "buttonClass" : "", "semesterID" : "2011/spring/", "semesterName" : "Spring 2011" , "disabled" : false };
	this.controller.setupWidget("button1", this.buttonAttributes, this.buttonModel1);
	Mojo.Event.listen(this.controller.get("button1"), Mojo.Event.tap, this.handleButtonPress1.bind(this));
	
	
	this.buttonModel2 = { "label" : "Fall 2010", "buttonClass" : "", "semesterID" : "2010/fall/", "semesterName" : "Fall 2010" ,"disabled" : false };
	this.controller.setupWidget("button2", this.buttonAttributes, this.buttonModel2);
	Mojo.Event.listen(this.controller.get("button2"), Mojo.Event.tap, this.handleButtonPress2.bind(this));
	
};


SemesterSelectAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

SemesterSelectAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

SemesterSelectAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};

SemesterSelectAssistant.prototype.handleButtonPress1 = function(event){
	this.semesterID = this.buttonModel1.semesterID;
	this.controller.stageController.pushScene("subjectSelect", this.semesterID, this.calendarId);
};

SemesterSelectAssistant.prototype.handleButtonPress2 = function(event){
	this.semesterID = this.buttonModel2.semesterID;
	this.controller.stageController.pushScene("subjectSelect", this.semesterID, this.calendarId);
};
