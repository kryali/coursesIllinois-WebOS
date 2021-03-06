==============================================================
coursesIllinois: 

Summary:
    coursesIllinois is a productivity application designed for University of Illinois students. The purpose is for the ability for a student to browse currently offered courses, add and remove them from a persistent list. Then, add the time of the class to the calendar. A reach goal is to create a tagging system for use with a task list. The language used in this project will be Javascript interfacing with Palm�s WebOS SDK. The relevant library is Prototype and Mojo.Test (which is included in the SDK). The targeted platforms are any devices running WebOS ex. Palm Pre, Palm Pre Plus, etc...

Motivation:
    The motivation behind choosing this application was to complete an application initially started for a developmental competition. This application was decided because I wanted to create something useful as well as interesting to create real value. The problem I intend to solve is the difficulty in students keeping track of both their classes and their assignments.
	
Notable Features:    
	1. Recieve information for specific courses			
	2. [FINISHED] Calendar integration - adding sections to calendar events
		- TODO: Store events, check for existing events etc.
    3. Saved courses - keeping track of a user's courses
    4. Task list tagging - tag assignments and todo's with saved course id
    5. [FINISHED] Searchable Lists - filter through courseList with user input 
				
==============================================================
Program Flow:
	1. User Starts Home Screen
	2. Selects "MyCourses Button"
	3. Launch SubjectSelectAssistant
	4. User Selects subject
	5. Launch ClassSelectAssistant
	6. User Selects a class
	7. Display all sections
	
=============================================================
CHANGELOG - 11/18/2010
=============================================================
BUGFIX: [SOLVED] classSelect - filter list would loop infinitely when scrolling
		[FIX] iterate from the offset of the current position

Edited files:
    subjectSelectAssistant.js 
		- created variable (this.calendarID to be passed to following scenes)
    classSelectAssistant.js
		- created variable (this.calendarID to be passed to following scenes)
    sectionSelectAssistant.js
		- parsed data to a event acceptable form and implemented add to calendar event
		/**
		 * createEvent: parses the selected class data and adds detail to the calendar
		 * @param {Object} calendarId - id of the calendar
		 * @param {Object} event - contains the list item 
		 * 
		 * NOTE: lots of debug statements gives the impression of a long function
		 */
				
	welcomePageAssitant.js
		: Added functions
		listCalendar, 
		/**
		 * *listCalendar is called on the creation of a calendar
		 * 		If the amount of calendars is > 0 then call the calendarCreated function
		 * @param {Object} response - contains the calendars created from the account 
		 */
		 
		assertionFailed,	 
		/**
		 * assertionFailed - called on failure of any function
		 * 				   - pops up a dialog mentioning error
		 * @param {Object} response - contains errorText about the failure and logs information about it
		 */

		calendarCreated, 
		/**
		 * Called on a succesful calendar creation, sets the global variable calendarId to the returned ID
		 * @param {Object} response - contains ID of calendar that was created
		 */
		 
		 createCalendar,
		/**
		 * Creates a calendar with the account calendarId
		 * @param {Object} response - contains the accountID of the synergy account
		 */
		 
		 
	classSelect-scene.html	
	subjectSelect-scene.html
	
=============================================================
CHANGELOG - 11/11/2010
=============================================================

Edited files:
    subjectSelectAssistant.js 
		- Implemented filterList
    classSelectAssistant.js
		- Implemented fliterList
	classSelect-scene.html
	subjectSelect-scene.html
		
Added Functions
	ClassSelectAssistant.prototype.searchList()
		-handles user input and returns matches for class name and description
	SubjectSelectAssistant.prototype.searchList()
		-handles user input and returns matches for subject name and title
=============================================================
TODO: 
1.	Integrate calendar addition to program (use Palm�s calendar API)
2.	Use a persistent list to store user�s courses and help manage calendars
3.	Either implement a task list or find a way to interact with Palm�s current task list