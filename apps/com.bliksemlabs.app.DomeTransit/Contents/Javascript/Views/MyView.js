// Create a class and extended it from the MAF.system.SidebarView
var MyView = new MAF.Class({
	ClassName: 'MyView',

	Extends: MAF.system.SidebarView,


	initialize: function () {
		var view = this;
		view.parent();
		// Register MAF messages listener to view.dataHasChanged
		view.registerMessageCenterListenerCallback(view.dataHasChanged);
	},

	dataHasChanged: function (event) {
		var view = this,
			controls = view.controls;
		if (event.payload.key === 'MyStations') {
			if (event.payload.value.length > 0) {
				controls.grid.changeDataset(event.payload.value, true);
				controls.grid.visible = true;
				controls.grid.focus();
			} else {
				controls.grid.visible = false;
			}
		}
	},


	createView: function () {
		console.log(profile);
		// Reference to the current view
		var view = this;
		var postcode;

		/*this._homeHandler = this.getKeyPress.subscribeTo(MAF.application, 'onWidgetKeyPress', this);*/

		var textEntryButtonLabel = new MAF.element.Text({
			label: $_('Zoek op postcode'),
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
			styles: {
				width: view.width - 10,
				height: 40,
				hOffset: textEntryButton.hOffset,
				vOffset: textEntryButton.outerHeight + 10
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
		var stationPickerButtonLabel = new MAF.element.Text({
			label: $_('Stations in de buurt'),
			styles: {
				height: 40,
				width: view.width - 40,
				hOffset: 10,
				vOffset: nextView.outerHeight + 50
			}
		}).appendTo(view);

		var stationList = view.controls.grid = new MAF.control.Grid({
			rows: 12,
			columns: 1,
			guid: 'stationGrid',
			styles: {
				width: view.width,
				height: 900,
				hOffset: 10,
				vOffset: stationPickerButtonLabel.outerHeight + 10,
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

	},

	updateView: function () {
		// Reference to the current view
		var view = this,
			latlng = profile && profile.latlon;
		if (latlng) {
			console.log('Latlng received from view', latlng);
			getStationData(latlng);
		}
	}
});
