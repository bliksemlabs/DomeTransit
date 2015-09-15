// Create a class and extended it from the MAF.system.SidebarView
var StopTimeView = new MAF.Class({
	ClassName: 'StopTimeView',

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
		if (event.payload.key === 'MyStopTimes') {
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
			guid: 'stopTimeGrid',
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
						}
					}
				});

                cell.time = new MAF.element.Text({
                    visibleLines: 1,
                    styles: {
                        fontSize: 20,
                        width: 100,
                        hOffset: 15,
                        vOffset: 15,
                        wrap: true,
                        truncation: 'end'
                    }
                }).appendTo(cell);
                cell.line = new MAF.element.Text({
                    visibleLines: 1,
                    styles: {
                        fontSize: 20,
                        width: 50,
                        hOffset: 100,
                        vOffset: 15,
                        wrap: true,
                        truncation: 'end'
                    }
                }).appendTo(cell);
				cell.name = new MAF.element.Text({
					visibleLines: 1,
					styles: {
						fontSize: 24,
						width: cell.width - 100,
						hOffset: 150,
						vOffset: 10,
						wrap: true,
						truncation: 'end'
					}
				}).appendTo(cell);

				return cell;
			},
			cellUpdater: function (cell, data) {
				cell.name.setText(data.destination);
                cell.time.setText(moment(data.aimedDepartureTime).format("HH:mm"));
                cell.line.setText(data.line.code);
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

	// After create view and when returning to the view
	// the update view is called
	updateView: function () {
		// Reference to the current view
		var view = this,
			id = view.persist && view.persist.id;
		if (id) {
			log('Got stop id from previous view', id);
			getStopTimeData(id);
		}
	}
});
