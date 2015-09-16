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

		var controlGrid = view.controls.grid = new MAF.control.Grid({
			rows: 12,
			columns: 1,
            ClassName: 'times',
			guid: 'stopTimeGrid',
			styles: {
				width: view.width,
				height: view.height - 60,
                vOffset: 0,
				visible: false
			},
			cellCreator: function () {
				// Create cells for the grid
				var cell = new MAF.control.GridCell({
					styles: this.getCellDimensions()
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
                    cell.time.element.addClass("time_delayed");
                    cell.element.addClass("row_delayed");
                } else if (delay < 0) {
                    cell.time.element.addClass("time_early");
                    cell.element.addClass("row_early");
                } else {
                    cell.time.element.addClass("time_ontime");
                    cell.element.addClass("row_ontime");
                }
				cell.name.setText(data.destination);
                cell.time.setText((actual === sched) ? sched.format("HH:mm") : actual.format("HH:mm"));
                cell.line.setText(data.line.code);
			}
		}).appendTo(view);

        var pageIndicator = new MAF.control.PageIndicator({
            styles: {
                height: 40,
                width: view.width,
                vOffset: controlGrid.outerHeight
            }
        }).appendTo(view);
		pageIndicator.attachToSource(controlGrid);
	},

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
