Theme.set({
    'item .BaseText': {
        styles: {
            color: 'rgba(200,200,200,1.0)'
        }
    },

    'focused .BaseText': {
        styles: {
            color: 'rgb(255,255,255)'
        }
    },

    'BaseGlow': {
        styles: {
            backgroundColor: 'rgba(0,0,0,0.3)'
        }
    },

    'BaseFocus': {
        styles: {
            color: 'rgba(255,255,255,1.0)',
            backgroundColor: 'rgba(255,0,0,0.3)'
        }
    },

    'time_delayed': {
        styles: {
            color: '#D32F2F'
        }
    },
    time_early: {
        styles: {
            color: '#FF5722'
        }
    },
    time_ontime: {
        styles: {
            color: '#009900'
        },
    },
    'focused .time_ontime': {
        styles: {
            color: '#ffffff'
        }
    },
    'focused .time_delayed': {
        styles: {
            color: '#ffffff'
        }
    },
    'focused .time_early': {
        styles: {
            color: '#ffffff'
        }
    },
    '.row_early .BaseFocus': {
        styles: {
            backgroundColor: '#FF5722'
        }
    },
    'row_delayed .BaseFocus': {
        styles: {
            backgroundColor: '#D32F2F'
        }
    },
    'row_ontime .BaseFocus': {
        styles: {
            backgroundColor: '#009900'
        }
    },
});
