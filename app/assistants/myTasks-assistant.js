/*
	Demonstrates use of the List widget to display an editable list of words.
	
	// FROM PALM SAMPLE
*/
function MyTasksAssistant(calendar, class) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */		
	   this.classTitle = class;
}

MyTasksAssistant.prototype.setup = function(){
		
		// Set up view menu with scene header
		//this.controller.setupWidget(Mojo.viewMenu, undefined, {items: [{label: $L("A Tasks List")}, {}]});
		
		// Set up a few models so we can test setting the widget model:
		this.tasksModel = {listTitle:$L(this.classTitle), items:this.listTestWordList};
		this.currentModel = this.tasksModel;
		
		// Set up the attributes & model for the List widget:
		this.controller.setupWidget('wordsList', 
						      {	itemTemplate:'myTasks/listitem', 
							  	listTemplate:'myTasks/listcontainer', 
							 	swipeToDelete:true, 
							 	reorderable:true, 
							 	emptyTemplate:'myTasks/emptylist',
								addItemLabel: $L('Add ...')},
						      this.tasksModel);
		
		
		// Watch relevant list events:
		this.wordsList = this.controller.get('wordsList');
		this.listAddHandler = this.listAddHandler.bindAsEventListener(this);
		this.listDeleteHandler = this.listDeleteHandler.bindAsEventListener(this)
		this.listChangeHandler = this.listChangeHandler.bindAsEventListener(this)
		this.listReorderHandler = this.listReorderHandler.bindAsEventListener(this)
		Mojo.Event.listen(this.wordsList, Mojo.Event.listChange, this.listChangeHandler);
		Mojo.Event.listen(this.wordsList, Mojo.Event.listAdd, this.listAddHandler);
		Mojo.Event.listen(this.wordsList, Mojo.Event.listDelete, this.listDeleteHandler);
		Mojo.Event.listen(this.wordsList, Mojo.Event.listReorder, this.listReorderHandler);
}
	
// Called for Mojo.Event.listAdd events.
// Adds a new item to the list.
MyTasksAssistant.prototype.listAddHandler = function(event){
		
		/*
		// This works, but refreshes the whole list:
		this.currentModel.items.push({data:"New item"});
		this.controller.modelChanged(this.currentModel, this);
		*/
		
		// The 'addItems' API will inserts the item where indicated, 
		// and then the list can potentially update only the added item.
		var newItem = {data:$L("New item")};
		this.currentModel.items.push(newItem);
		this.wordsList.mojo.addItems(this.currentModel.items.length, [newItem]);
		
}
	
	// Called for Mojo.Event.listDelete events.
	// Removes the deleted item from the model (and would persist the changes to disk if appropriate).
	// The list's DOM elements will be updated automatically, unless event.preventDefault() is called.

MyTasksAssistant.prototype.listDeleteHandler = function(event){
		Mojo.log("MyTasksAssistant deleting '"+event.item.data+"'.");
		this.currentModel.items.splice(this.currentModel.items.indexOf(event.item), 1);
}
	
	// Called for Mojo.Event.listReorder events.
	// Modifies the list item model to reflect the changes.
MyTasksAssistant.prototype.listReorderHandler = function(event){
		this.currentModel.items.splice(this.currentModel.items.indexOf(event.item), 1);
		this.currentModel.items.splice(event.toIndex, 0, event.item);
}
	
	
	// Called for Mojo.Event.listChange events, which are sent when a 'change' event comes from a list item.
	// Saves the new value into the model.
MyTasksAssistant.prototype.listChangeHandler = function(event){
		if(event.originalEvent.target.tagName == "INPUT") {
			event.item.data = event.originalEvent.target.value;
			console.log("Change called.  Word is now: "+event.item.data);
		}
}
	
	// Focus the text field in a random list item:
MyTasksAssistant.prototype.focusRandom = function(event){
		var index = Math.floor(Math.random() * this.currentModel.items.length);
		this.wordsList.mojo.focusItem(this.currentModel.items[index]);
}
	
// Show/hide the special "Add..." item.
MyTasksAssistant.prototype.changeAddItem = function(event){
		this.wordsList.mojo.showAddItem(event.target.value);
}

MyTasksAssistant.prototype.changeListVisible = function(event){
		var visible = !!event.target.value;
		
		if(visible) {
			Element.show(this.wordsList);
		} else {
			Element.hide(this.wordsList);
		}
		
}	
	
MyTasksAssistant.prototype.cleanup = function(event){
	Mojo.Event.stopListening(this.wordsList, Mojo.Event.listChange, this.listChangeHandler);
	Mojo.Event.stopListening(this.wordsList, Mojo.Event.listAdd, this.listAddHandler);
	Mojo.Event.stopListening(this.wordsList, Mojo.Event.listDelete, this.listDeleteHandler);
	Mojo.Event.stopListening(this.wordsList, Mojo.Event.listReorder, this.listReorderHandler);
	
}	

MyTasksAssistant.prototype.listTestWordList = [
		];
	

MyTasksAssistant.prototype.noItems = [];


