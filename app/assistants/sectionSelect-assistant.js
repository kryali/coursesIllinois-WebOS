/*
*	SectionSelectAssistant
*		main role: report data about the sections in a class
*		method: send a http request containing course number, subject name, and semester
*		to catalog, then parse the response to get the class list
*/

/**
*	SectionSelectAssistant(url,  title, subject)
*		main role: build url for request
*		method   : uses course subject and class number to build url for ajax request
*/
function SectionSelectAssistant(url,  title, subject, calendarId) {
	this.newurl = url + "/" + title + ".html";
	this.subject = subject;
	this.title = title;
	this.calendarId = calendarId;
	Mojo.Log.info("SectionSelect: %d", this.calendarId);
	//DEBUG: Mojo.Log.info("TITLE:" + this.title);
	//		 Mojo.Log.info("TITLE:" + this.newurl);
	var options = { name: 'coursesIllinois', version: 1, replace: false, estimatedSize: 100000 };  
    this.depot = new Mojo.Depot(options, this.gotDepot.bind(this), this.failureHandler.bind(this));  
	//this.depot.removeAll(null,null);
   
}

SectionSelectAssistant.prototype.gotDepot = function(object){
	Mojo.Log.info("Getting class list from depot!");
	/*try {
		this.depot.get("classes", this.grabClasses.bind(this), this.failure.bind(this));
	}
	catch (e){
		Mojo.Log.error(e);
	}*/
}

SectionSelectAssistant.prototype.grabClasses = function(object){
	
	if(object==null){
		Mojo.Log.info("Got null from grabClasses");
		this.currentClasses = new Array();
	}else{
		this.currentClasses = object;
	}
	
		
	Mojo.Log.info("Event: %s", this.event.subject);
	if(this.currentClasses==null){
		Mojo.Log.info("NULL!");
		this.currentClasses = new Array();
	}
	else{
		for(var i = 0; i < this.currentClasses.length; i++){
			if(this.currentClasses[i]==this.event.subject){
				Mojo.Log.info("Found duplicate!");
				return;
			}
		}
	}
	this.currentClasses.push(this.event.subject);
	this.depot.add("classes", this.currentClasses,this.addedValue.bind(this),this.failureHandler.bind(this));

	
      this.controller.showAlertDialog({
         onChoose: function(value) {},
         title: $L("Class Added!"),
         message: $L(""),
         choices: [{
            label: $L("OK"),
            value: ""
         }]
      });
	
}

/**
 * Displays succes dialog on the addition of a class to the calendar
 * @param {Object} event - event that is bound to the function
 */
SectionSelectAssistant.prototype.successEvent = function(event){
	try {
		if(this.depot==null){
			Mojo.Log.info("well, fuck");
		}
		this.depot.get("classes", this.grabClasses.bind(this), this.failureHandler.bind(this));
	}
	catch (e){
		Mojo.Log.error(e);
	}
}

/**
 * DEBUG Purposes: logs erronous data
 * @param {Object} response
 */
SectionSelectAssistant.prototype.failureHandler = function(response){
	Mojo.Log.error("function failed, reason: %s", response.errorText);
}
/**
 * DEBUG Purposes: logs erronous data
 * @param {Object} response
 */
SectionSelectAssistant.prototype.addedValue = function(response){
	Mojo.Log.info("Added Key");
	for(var i =0; i < this.currentClasses.length; i++){
		Mojo.Log.info("Current Class: %s", this.currentClasses[i]);
	}
}

/**
 * createEvent: parses the selected class data and adds detail to the calendar
 * @param {Object} calendarId - id of the calendar
 * @param {Object} event - contains the list item 
 * 
 * NOTE: lots of debug statements gives the impression of a long function
 */
SectionSelectAssistant.prototype.parseEvent = function(calendarId, event){
	
	// Make sure that the selected item has data to add to the calendar
	if(event.item.time == ""){
		Mojo.Log.error("No Data");
		return;
	}
	// Can be removed, disambiguates the variables to useful and easy names
	//var crn = event.item.crn;
	//var type = event.item.type;
	var instructor = event.item.instructor;
	var location = event.item.location;
	var section = event.item.section;
	var days = event.item.days;
	var time = event.item.time;
	var timeOffset = 0;
	//Mojo.Log.info("crn:%s\ninstructor:%s\ndays:%s\ntime:%s", location, instructor, days, time);
	
	// ========= START time parsing  =========
	timeArr = time.toString().split(","); 		// split start and end times
	Mojo.Log.info(timeArr[0]);					// timeArr[0] start Time
	Mojo.Log.info(timeArr[1]);					// timeArr[1] end Time
	time = timeArr[0].split(" ");				// Remove the PM from the string
	hoursAndMinutes = time[0].split(":");		// Split the start time into hours and minutes
	startHours = parseInt(hoursAndMinutes[0]);
	startMinutes = parseInt(hoursAndMinutes[1]);
	Mojo.Log.info("StartHours: %d", startHours);
	Mojo.Log.info("StartMinutes: %d", startMinutes);
	hoursAndMinutes = timeArr[1].split(" ")[0].split(":");	//Split the end time into hours and minutes
	endHours = parseInt(hoursAndMinutes[0]);
	endMinutes = parseInt(hoursAndMinutes[1]);
	
	Mojo.Log.info("endHours: %d", endHours);
	Mojo.Log.info("endMinutes: %d", endMinutes);
	
	// Use an offset variable to calculate the offset
	for( var j =0; j<time.length; j++){
		if (time[j] == "PM") {
			timeOffset = 43200;
			if( endHours!= 12)
				endHours += 12;
			if(startHours != 12)
				startHours += 12;
		}
	}
	Mojo.Log.info(startHours);
	
	// Create a date variable and set the set the the hours
	// and minutes to the timeStamp of the class start time
	var startTime = new Date();
	startTime.setHours(startHours);
	startTime.setMinutes(startMinutes);
	startTime.setFullYear(2010);
	//startTime.setMilliseconds(0);
	//startTime.setSeconds(0);
	
	Mojo.Log.info(startTime);
	startTime = startTime.getTime();
	//startTime += timeOffset;
	// Apply the same algorithm to the endTime
	var endTime = new Date();
	endTime.setHours(endHours);
	endTime.setFullYear(2010);
	endTime.setMinutes(endMinutes);
	//endTime.setMilliseconds(0);
	//endTime.setSeconds(0);
	endTime = endTime.getTime();
	//endTime += timeOffset;
	
	Mojo.Log.info(new Date(endTime));
	// According to rfc2445 standards
	var rrule = "RRULE:FREQ=WEEKLY;BYDAY="; // Assumption - All classes are weekly
	// Split the days string into an array of days [M,W,F] -> [M;W;F]
	var days2 = days.toString().split(",");
	for(var i =0; i < days2.length; i++){
		//Mojo.Log.info("!:%s", days[i]);
		if(i!=0 && i!= days2.length)		// If the array is not at the beginning or end ,add a commma
			rrule += ",";
		if(days[i]=="M")					// Convert the days into rfc2445 standards
			rrule += "MO";
		else if(days[i]=="T")
			rrule += "TU";
		else if(days[i]=="W")
			rrule += "WE";
		else if(days[i]=="R")
			rrule += "TH";
		else if(days[i]=="F")
			rrule += "FR";
	}
	
	//TESTS - CS 125
	if(endHours ==2)
		Mojo.Log.info("PASSED! EndHours: %d", endHours);
	if(endMinutes ==50)
		Mojo.Log.info("PASSED! EndMinutes: %d", endMinutes);	
	if(startHours ==2)
		Mojo.Log.info("PASSED! startHours: %d", startHours);
	if(startMinutes ==00)
		Mojo.Log.info("PASSED! startMinutes: %d", startMinutes);	
	if( rrule == "RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR")
		Mojo.Log.info("PASSED! rrule: %d", rrule);
	
	//var endDate = new Date(endTime);
	//var year = endDate.getFullYear();
	//Mojo.Log.info("full:%s", year);
	//Mojo.Log.info(rrule);
	location = location.toString().replace(/(<([^>]+)>)/ig,""); 	// Remove the HTML from the location string
	//Mojo.Log.info("Creating Event");
//	Mojo.Log.info("startTime: %d", startTime);
//	Mojo.Log.info("endTime: %d", endTime);
	
	event = {
               subject: (this.subject + this.title).toString(),
               allday: "false",
               location: location.toString(),
               startTimestamp: startTime,
               endTimestamp: endTime,
			   //rrule: "RRULE:FREQ=WEEKLY;BYDAY=TU,TH",
			   rrule: rrule,
			   rruleTZ: "America/Dawson",							// Hack: simulator timezone set to PST
			   note: instructor.toString(),
               alarm: "none",
               attendees: []
            };
	this.checkConflicts(calendarId, event);
	//this.addEvent(this.calendarId, event);
}



SectionSelectAssistant.prototype.checkEvents = function(array){
	events = array.events;
	//Mojo.Log.info("%d-%d", this.start, this.end);
		
	for(var i =0; i < events.length; i++){
		if( (this.start >= events[i].startTimestamp && this.start <= events[i].endTimestamp)
		|| (this.end >= events[i].startTimestamp && this.end <= events[i].endTimestamp)){
 			 Mojo.Controller.errorDialog("Class conflict exists: "+ events[i].subject + "-" + events[i].note );
			return;
		}
	}
	this.addEvent(this.calendarId, this.event);
}

SectionSelectAssistant.prototype.checkConflicts = function(calendarId, event){
	//Mojo.Log.info("START: %d", event.startTimestamp);
	//Mojo.Log.info("END: %d", event.endTimestamp);
	this.start = event.startTimestamp;
	this.end = event.endTimestamp;
	this.calendarId = calendarId;
	this.event = event;
	this.controller.serviceRequest('palm://com.palm.calendar/crud/', {
		method: 'listEvents',
		parameters: {
			calendarId: calendarId,
			limit: 500,
			offset: 0,
			//startTimestamp: event.startTimestamp,
			//endTimestamp: event.endTimestamp,
			// Need to get the timezone object to calculate differences in timezones
			tzFormqt: 'object'
		},
		onSuccess: this.checkEvents.bind(this),
		onFailure: this.failureHandler.bind(this)
	});
}


SectionSelectAssistant.prototype.addEvent = function(calendarId, event){
	
	// Main event request
	 this.controller.serviceRequest('palm://com.palm.calendar/crud', {
         method: 'createEvent',
         parameters: {
            calendarId: calendarId,
            trackChange: true,
            event: event
         },
         onSuccess: this.successEvent.bind(this),
         onFailure: this.failureHandler.bind(this)
      });
  }

/**
*	setup- main role: intialize ui objects and initiate the ajax request
*/
SectionSelectAssistant.prototype.setup = function() {
	
	// Update the header of the section description with the subject name and class number
	this.controller.get("header").update(this.subject + " " + this.title);
	
	// Start the ajax request with the newurl built from the constructor
	Mojo.Log.info("==============AJAX REQUEST==============="); 
	var request = new Ajax.Request(this.newurl, {
		method: "get",
		evalJSON: "false",
		onLoaded : function(response){
			Mojo.Log.info("Loaded Request");
		},
		onSuccess: function(response){
			Mojo.Log.info("Success Request");
		},
		// On the success path of the ajax request, bind the response to the parse function
		onComplete: this.parseIt.bind(this),
		onFailure: function(response){
			Mojo.Log.info("Failed Request");
		}
	});
	
	// Initialize and set up the list widget
	this.myListModel = { items : [ ] };
	this.myListAttr = {
		itemTemplate: "sectionSelect/itemTemplate",
		renderLimit: 20
	};
	this.controller.setupWidget("MyList",this.myListAttr,this.myListModel);
	this.controller.listen(this.controller.get("MyList"), Mojo.Event.listTap, this.listTap.bind(this));
	
};

SectionSelectAssistant.prototype.listTap = function(event){
	
	
      this.controller.showAlertDialog({
         onChoose: function(value) {
		 	if(value==0){
				this.parseEvent(this.calendarId, event);
			}
		 },
         title: $L("Add to Calendar"),
         message: $L(""),
         choices: [
		 	{label: $L("YES"),value: 0, type:'affirmative'},
		 	{label: $L("NO"),value: 1, type:'negative'}
         ]
      });
}

/**
*	loadList(response) - called upon the success pathway of the ajax request
				main role: parse through resulting request and populate the list widget
				with the resulting section information
				side role: build an object array of subjects (future data manipulation) 
*/
SectionSelectAssistant.prototype.parseIt = function(response) {

	// classObject definition - defines all data about the section
	function classObject(){
		this.crn = -1;
		this.type = -1;
		this.section = -1;
		this.time = -1;
		this.days = -1;
		this.location = -1;
		this.instructor = -1;
		this.initial = -1;						// Instructor's last name initial used for ratemyprofessors.com
		this.notes = -1;						// TODO: implement parsing for section notes (low priority)
	}
	
	// notGoingInDom:  temporary div that contains the ajax response
	//	   main role:	enable use of javascript DOM manipulation
	var notGoingInDom =  this.controller.get(document).createElement('div'); 
 	notGoingInDom.innerHTML = response.responseText;
	
	// Section data is stored in the first table of the response
	var oTable = notGoingInDom.getElementsByTagName("table");
	oTable = oTable[0];
	myrows =oTable.rows;
	this.sections = new Array();

	try{
		// Grab the course description since it's wrapped in class="ws-description"
		courseDescription = notGoingInDom.getElementsByClassName("ws-description")[0].innerHTML;
	} catch (e){
		Mojo.Log.error(e);
	}
	
	// Update the subtext of the header with the courseDescription
	this.controller.get("subtext").update(courseDescription);
	
	// Iterate through the rows of the table and pick out the data you want
	for( var i = 1; i < myrows.length; i++){
		currentRow = myrows[i].getElementsByClassName("ws-row");
		var currentSection = new classObject();
		for( var j = 0; j < currentRow.length; j++){
			currentAttribute = currentRow[j].getAttribute("headers");
			currentText = currentRow[j].innerHTML;
			
			// Use Regular Expressions to parse the data depending on the defining attribute
			//	i.e: crn is a five digit number, thus str.match(/\d\d\d\d\d/g)
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
				currentSection.initial = currentText.match(/[A-Z]/i);
				Mojo.Log.info(currentSection.initial);
			}
		}		
		//Mojo.Log.info(currentSection.instructor);
		
		if(currentRow.length !=0 ){
			this.sections.push(currentSection);
		}
	}	
	
	Mojo.Log.info("Finished Parsing");
	Mojo.Log.info(this.sections.length);
	
	for( var i = 0; i < this.sections.length; i++){
		currentSection = this.sections[i];
		// Push the data of the section as a list element
		this.myListModel.items.push({initial: currentSection.initial, crn: currentSection.crn, type: currentSection.type, instructor: currentSection.instructor, location: currentSection.location, section: currentSection.section, days: currentSection.days, time: currentSection.time});
	}
	
	//update the model with the new information
	this.controller.modelChanged(this.myListModel);
}

SectionSelectAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

SectionSelectAssistant.prototype.deactivate = function(event) {
	//TODO: stop listening
};

SectionSelectAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
