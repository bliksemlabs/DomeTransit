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

        var pageIndicator = new MAF.control.PageIndicator({
            styles: {
                height: 40,
                width: view.width,
                hOffset: 0
            }
        }).appendTo(view);

		var controlGrid = view.controls.grid = new MAF.control.Grid({
			rows: 12,
			columns: 1,
			guid: 'stopTimeGrid',
			orientation: 'vertical',
			styles: {
				width: view.width - 20,
				height: view.height - pageIndicator.height,
                vOffset: pageIndicator.height,
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
                        fontSize: 28,
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
                        hOffset: 120,
                        vOffset: 20,
                        wrap: true,
                        truncation: 'end'
                    }
                }).appendTo(cell);
				cell.name = new MAF.element.Text({
					visibleLines: 1,
					styles: {
						fontSize: 24,
						width: cell.width - 170,
						hOffset: 170,
						vOffset: 15,
						wrap: true,
						truncation: 'end'
					}
				}).appendTo(cell);

				return cell;
			},
			cellUpdater: function (cell, data) {
                var sched = moment(data.aimedDepartureTime);
                var actual = (data.estimatedDepartureTime) ? moment(data.estimatedDepartureTime) : sched;
                var delay = sched.diff(actual, 'seconds');
                if (delay > 0) {
                    cell.time.element.addClass("trip_delayed")
                } else if (delay < 0) {
                    cell.time.element.addClass("trip_early")
                } else {
                    cell.time.element.addClass("trip_ontime")
                }
				cell.name.setText(data.destination);
                cell.time.setText((actual == sched) ? sched.format("HH:mm") : actual.format("HH:mm"));
                cell.line.setText(data.line.code);
			}
		}).appendTo(view);

		// Attach the scrollIndicator to the grid with news items
		pageIndicator.attachToSource(controlGrid);
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
