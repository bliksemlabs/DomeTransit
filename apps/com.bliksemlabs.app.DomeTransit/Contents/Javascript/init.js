// Include your views
include("Javascript/core/API.js");
include('Javascript/Views/MyView.js');
include('Javascript/Views/HalteView.js');
include('Javascript/Views/StopTimeView.js');

// Init application with view config
MAF.application.init({
	views: [
		{ id: 'view-MyView', viewClass: MyView },
        { id: 'view-HalteView', viewClass: HalteView },
        { id: 'view-StopTimeView', viewClass: StopTimeView },
		{ id: 'view-About', viewClass: MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'view-MyView', // Declare what view to be loaded when opening the app
	settingsViewId: 'view-About' // Declare what view is opened when a used loads the settings
});
