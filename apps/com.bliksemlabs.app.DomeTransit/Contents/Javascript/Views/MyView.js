// Create a class and extended it from the MAF.system.SidebarView

var NumberEntryDialog = new MAF.Class({
    ClassName: 'NumberEntryDialog',
    Extends: MAF.dialogs.BaseDialogImplementation,

    config: {
        title: '',
        message: '',
        callback: null,
        cancelCallback: null,
        maxLength: 99
    },

    initialize: function () {
        this.parent();
    },

    getDialogConfig: function() {
        return {
            type: 'textentry',
            conf: {
                maxLength: this.config.maxLength,
                'ignoreBackKey': this.config.isModal,
                key: this.retrieve('key'),
                title: this.config.title,
                message: this.config.message,
                layout:'numeric-decimal'
            }
        };
    },
    handleCallback: function (response) {
        //this.toggleKeyListener(false);
        if (response.cancelled) {
            if (this.config.cancelCallback && this.config.cancelCallback.call) {
                this.config.cancelCallback(response);
            }
        } else {
            if (this.config.callback && this.config.callback.call) {
                this.config.callback(response);
            }
        }
    }
});

var ZipCodeButton = function(){
    return new MAF.Class({
        Extends: MAF.control.InputButton,
        ClassName:'ZipCodeButton',
        initialize: function() {
            this.parent();
            console.log(this.config);
        },
        changeValue: function(){
            var scope = this;
            new NumberEntryDialog(
			{
                maxLength: 4,
                title: FontAwesome.get('search')+' '+ $_('Zoek op postcode cijfers'),
                callback: function (callback){
                    scope.setValue(parseInt(callback.response));
                    //Zoek hier (API)

                    MAF.application.loadView('view-HalteView', {
                        postcode: parseInt(callback.response)
                    });

                }
            }).show();
        }
    });
}();

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

        var textEntryButton = new ZipCodeButton({
			label: $_('Vul je postcode in'),
			styles: {
				width: view.width - 10,
				hOffset: textEntryButtonLabel.hOffset,
				vOffset: textEntryButtonLabel.outerHeight,
                height: 100
			},
			events: {
				onCancel: function () {
					this.valueDisplay.setText('');
				},
                onFocus: function () {
                    this.setStyle('backgroundColor', Theme.getStyles('BaseFocus', 'backgroundColor'));
                },
                onBlur: function () {
                    this.setStyle('backgroundColor', Theme.getStyles('BaseGlow', 'backgroundColor'));
                }

			}
		}).appendTo(view);

		var stationPickerButtonLabel = new MAF.element.Text({
			label: $_('Stations in de buurt'),
			styles: {
				height: 40,
				width: view.width - 40,
				hOffset: 10,
				vOffset: textEntryButton.outerHeight + 50
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
