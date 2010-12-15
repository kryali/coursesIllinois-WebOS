function MyCoursesAssistant(calendarId) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
    var options = { name: 'coursesIllinois', version: 1, replace: false, estimatedSize: 100000 };  
    this.depot = new Mojo.Depot(options, this.depotInitializeSuccess.bind(this), this.failure.bind(this));  
	this.calendarId = calendarId;
}

MyCoursesAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */

		
	// declare the list attributes
	this.myListAttr = {
		listTemplate: "subjectSelect/listTemplate",
		itemTemplate: "subjectSelect/itemTemplate",
		renderLimit: 20
	};
	this.myListModel = {items :[]};
  	
	
	// set up the list model with declared attribute
	this.controller.setupWidget("MyList",this.myListAttr,this.myListModel);
	// bind to the listTap event to the listTap function
	this.controller.listen(this.controller.get("MyList"), Mojo.Event.listTap, this.listTap.bind(this));
	

};

MyCoursesAssistant.prototype.listTap = function(event){
	if(event.item.title == "(+)")
		this.controller.stageController.pushScene("semesterSelect",this.calendarId);
    else{
		  this.controller.showAlertDialog({
        	onChoose: function(value) {
				if (value == 0) {
<<<<<<< HEAD
					this.controller.stageController.pushScene("myTasks", this.calendarId, event.item.description);
=======
					this.controller.stageController.pushScene("myTasks", this.calendarId);
>>>>>>> 22b4e0a8eea79b6b9ce3ade5e9b8a844b826ccd6
				}
				else {	
					
					this.myListModel.items.splice(value-1, 1);
					
					this.controller.modelChanged(this.myListModel);
				}
				},
       		title: $L("Select an Option"),
      		message: $L(""),
         	choices: [
				{label: $L("Add Task"),value: 0, type:'affirmative'},
            	{label: $L("Remove"),value: event.item.title, type:'negative'}
         	]
		   });
	}
}

MyCoursesAssistant.prototype.depotInitializeSuccess = function(object){
	try {
		this.depot.get("classes", this.grabClasses.bind(this), this.failure.bind(this));
	}
	catch (e){
		Mojo.Log.error(e);
	}
}

MyCoursesAssistant.prototype.grabClasses = function(object){
	if(object == null){
		  this.controller.showAlertDialog({
        	onChoose: function(value) {this.controller.stageController.pushScene("semesterSelect",this.calendarId);},
       		title: $L("No Classes, go add one!"),
      		message: $L(""),
         	choices: [{
            	label: $L("OK"),
            	value: ""
         	}]
      });
	} else {
		//this.items = new Array();
		for(var i = 0; i< object.length;i++){
			Mojo.Log.info("CLASSES: %s", object[i]);
			this.myListModel.items.push({title: (i+1), description: object[i]});
		}
	}
	//this.myListModel.items = this.items;
	this.myListModel.items.push({title: "(+)", description: "Add another class"});
	this.controller.modelChanged(this.myListModel);
}
MyCoursesAssistant.prototype.failure = function(object){
	Mojo.Controller.errorDialog(object.errorText);
}

MyCoursesAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

MyCoursesAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

MyCoursesAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
