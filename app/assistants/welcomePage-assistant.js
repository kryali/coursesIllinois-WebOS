function WelcomePageAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}


/**
 * *listCalendar is called on the creation of a calendar
 * 		If the amount of calendars is > 0 then call the calendarCreated function
 * @param {Object} response - contains the calendars created from the account 
 */
WelcomePageAssistant.prototype.listCalendar = function(response){
	
	//Mojo.Log.info("listCalendar: %s", response.calendarId);
	//Mojo.Log.info(response.calendars[0]);
	this.controller.serviceRequest('palm://com.palm.calendar/crud', {
        method: 'listCalendars',
        parameters: {
           accountId: this.accountId
        },
        onSuccess: function(response) {
			Mojo.Log.info(this.accountId);
           if (response.calendars && response.calendars.length > 0) {
              //this.listEvent(response.calendars[0]);
			  //Mojo.Log.info("Logged Info: %s", response.calendars[0]);
			  this.calendarCreated(response.calendars[0]);
           } else {
              this.createCalendar(this.accountId);
           }
        }.bind(this),
        onFailure: this.assertionFailed.bind(this)
     });
}

/**
 * accountCreated called on a successful account creation
 * @param {Object} response - contains accountID of calendar and synergy account
 */
WelcomePageAssistant.prototype.accountCreated = function (response){
	//Mojo.Log.info("%s", response.accountId);
	this.accountId = response.accountId;
}

/**
 * assertionFailed - called on failure of any function
 * 				   - pops up a dialog mentioning error
 * @param {Object} response - contains errorText about the failure and logs information about it
 */
WelcomePageAssistant.prototype.assertionFailed = function (response){
	Mojo.Log.error("function failed, reason: %s", response.errorText);
      this.controller.showAlertDialog({
         onChoose: function(value) {},
         title: $L("Failed!"),
         message: $L("Error Text: %s", response.errorText),
         choices: [{
            label: $L("OK"),
            value: ""
         }]
      });
}

/**
 * Called on a succesful calendar creation, sets the global variable calendarId to the returned ID
 * @param {Object} response - contains ID of calendar that was created
 */
WelcomePageAssistant.prototype.calendarCreated = function (response){
	Mojo.Log.info(response);
	this.calendarId = response.calendarId;
	Mojo.Log.info("response: %s", this.calendarId);
}

/**
 * Creates a calendar with the account calendarId
 * @param {Object} response - contains the accountID of the synergy account
 */
WelcomePageAssistant.prototype.createCalendar = function(response) {
 	//Mojo.Log.info("Creating Calendar");
	//Mojo.Log.info("ID: %d", response.accountId);
	this.accountId = response.accountId;
      this.controller.serviceRequest('palm://com.palm.calendar/crud', {
         method: 'createCalendar',
         parameters: {
            accountId: response.accountId,
            calendar: {
               name: "Class Schedule",
               externalId: ""
            },
            trackChange: true
         },
         onSuccess: this.listCalendar.bind(this),
         onFailure: this.assertionFailed.bind(this)
      });
 }

/**
 * Setup function for the scene
 */
WelcomePageAssistant.prototype.setup = function() {
	
	
	// Create an account for synergy use
	Mojo.Log.info("Creating account");
	 this.controller.serviceRequest("palm://com.palm.accounts/crud", {
         method: "createAccount",
         parameters: {
            username: "coursesIllinois",
            domain: "cs242",
            displayName: "coursesIllinois",
            icons: {
               "32x32": Mojo.appPath + "icon.png"
            },
            dataTypes: ["Calendar"],
            isDataReadOnly: false
         },
         onSuccess: this.createCalendar.bind(this),
         onFailure: this.assertionFailed.bind(this)
      }); //end create accounts

	
	// NOTE: Couldn't find an elegant way for two buttons to use the same function
	//		- experimented with event.target.id, but documentation was scarce
	
	this.buttonModel = { "label" : "Add Courses", "buttonClass" : "", "disabled" : false };
	this.controller.setupWidget("button1", this.buttonAttributes, this.buttonModel);
	Mojo.Event.listen(this.controller.get("button1"), Mojo.Event.tap, this.handleButtonPress.bind(this));
	
	this.buttonModel2 = { "label" : "My Courses", "buttonClass" : "", "disabled" : false };
	this.controller.setupWidget("button2", this.buttonAttributes, this.buttonModel2);
	Mojo.Event.listen(this.controller.get("button2"), Mojo.Event.tap, this.handleButtonPress2.bind(this));
	
	this.buttonModel3 = { "label" : "My Tasks", "buttonClass" : "", "disabled" : false };
	this.controller.setupWidget("button3", this.buttonAttributes, this.buttonModel3);
	Mojo.Event.listen(this.controller.get("button3"), Mojo.Event.tap, this.handleButtonPress3.bind(this));
};

WelcomePageAssistant.prototype.handleButtonPress = function(event){
	this.controller.stageController.pushScene("myCourses", this.calendarId);
}
WelcomePageAssistant.prototype.handleButtonPress2 = function(event){
	this.controller.stageController.pushScene("semesterSelect", this.calendarId);
}
WelcomePageAssistant.prototype.handleButtonPress3 = function(event){
	this.controller.stageController.pushScene("myTasks");
}

WelcomePageAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

WelcomePageAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

WelcomePageAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};



