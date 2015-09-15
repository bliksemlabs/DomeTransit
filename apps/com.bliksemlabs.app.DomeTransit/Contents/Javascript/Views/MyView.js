// Create a class and extended it from the MAF.system.SidebarView
var MyView = new MAF.Class({
	ClassName: 'MyView',

	Extends: MAF.system.SidebarView,


	//getKeyPress: function(e) {
	//	this.postcode += e.Event.key;
	//	console.log("Got "+e.Event.key);
	//},

	// Create your view template
	createView: function () {
		// Reference to the current view
		var view = this;
		var postcode;

		/*this._homeHandler = this.getKeyPress.subscribeTo(MAF.application, 'onWidgetKeyPress', this);*/

		var textEntryButtonLabel = new MAF.element.Text({
			label: $_('Kies je postcode'),
			styles: {
				height: 40,
				width: view.width - 40,
				hOffset: 10
			}
		}).appendTo(view);
		var textEntryButton = new MAF.control.TextEntryButton({
			label: $_('Voer je postcode in (1111)'),
			keyboard: {
				layout: "numeric-decimal"
			},
			styles: {
				width: view.width - 10,
				hOffset: textEntryButtonLabel.hOffset,
				vOffset: textEntryButtonLabel.outerHeight
			},
			events: {
				onCancel: function () {
					this.valueDisplay.setText('');
				}
			}
		}).appendTo(view);

		var nextView = view.controls.nextView = new MAF.control.TextButton({
			label: $_('Kies Bushalte'),
			ClassName: "testButton",
			styles: {
				width: view.width - 10,
				height: 40,
				hOffset: textEntryButton.hOffset,
				vOffset: view.height - 100
			},
			textStyles:{
				hOffset: 10
			},
			content: [
				new MAF.element.Text({
					label: FontAwesome.get('chevron-right'), // Create a FontAwesome icon
					styles: {
						height: 'inherit',
						width: 'inherit',
						hOffset: -10,
						anchorStyle: 'rightCenter'
					}
				})
			],
			events: {
				onSelect: function () {
					// Load next Example view with data
					MAF.application.loadView('view-HalteView', {
						postcode: textEntryButton.getDisplayValue()
					});
				}
			}
		}).appendTo(view);

	}

	//destroyView: function() {
	//	this._homeHandler.unsubscribeFrom(MAF.application, 'onWidgetKeyPress');
	//}
});
