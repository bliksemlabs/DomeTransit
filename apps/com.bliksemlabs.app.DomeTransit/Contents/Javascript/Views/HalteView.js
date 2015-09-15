// Create a class and extended it from the MAF.system.SidebarView
var HalteView = new MAF.Class({
	ClassName: 'HalteView',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		var view = this;
		view.parent();
		// Register MAF messages listener to view.dataHasChanged
		view.registerMessageCenterListenerCallback(view.dataHasChanged);
	},

	// Create your dataHasChanged function
	dataHasChanged: function (event) {
		var view = this,
			controls = view.controls;
		console.log(event.payload.key);
		if (event.payload.key === 'MyBushaltes') {
			if (event.payload.value.length > 0) {
				controls.grid.changeDataset(event.payload.value, true);
				controls.grid.visible = true;
				controls.grid.focus();
			} else {
				controls.grid.visible = false;
			}
		}
	},

	// Create your view template
	createView: function () {
		// Reference to the current view
		var view = this;
		// Create a Grid, by adding it into the view.controls object and
		// setting guid focus will be remembered when returning to the view
		var controlGrid = view.controls.grid = new MAF.control.Grid({
			rows: 12,
			columns: 1,
			guid: 'halteGrid',
			orientation: 'vertical',
			styles: {
				width: view.width - 20,
				height: view.height,
				visible: false
			},
			cellCreator: function () {
				// Create cells for the grid
				var cell = new MAF.control.GridCell({
					styles: this.getCellDimensions(),
					events: {
						onSelect: function () {
							MAF.application.loadView('view-StopTimeView', {
								id: this.getCellDataItem().properties.id
							});
						}
					}
				});

				cell.name = new MAF.element.Text({
					visibleLines: 1,
					styles: {
						fontSize: 24,
						width: cell.width - 20,
						hOffset: 10,
						vOffset: 10,
						wrap: true,
						truncation: 'end'
					}
				}).appendTo(cell);

				cell.city = new MAF.element.Text({
					visibleLines: 1,
					styles: {
						fontSize: 18,
						width: cell.width - 20,
						hOffset: 10,
						vOffset: cell.name.outerHeight + 5,
						wrap: true,
						truncation: 'end'
					}
				}).appendTo(cell);

				return cell;
			},
			cellUpdater: function (cell, data) {
				cell.name.setText(data.properties.openbareruimtenaam);
				cell.city.setText(data.properties.woonplaatsnaam);
			}
		}).appendTo(view);

		// Create a scrolling indicator next to the grid to
		// indicate the position of the grid and ake it possible
		// to quickly skip between the pages of the grid
		var scrollIndicator = new MAF.control.ScrollIndicator({
			styles: {
				height: controlGrid.height,
				width: 20,
				hOffset: view.width - 20
			}
		}).appendTo(view);

		// Attach the scrollIndicator to the grid with news items
		scrollIndicator.attachToSource(controlGrid);
	},

	updateView: function () {
		console.log("Called updateView");
		// Reference to the current view
		var view = this,
			postCode = view.persist && view.persist.postcode;
		if (postCode) {
			console.log('Postcode received from view', postCode);
			getHalteData(postCode);
		}
	}
});
