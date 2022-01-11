class ColorSet {

    constructor(theme, useHighContrast) {
        this.theme = theme;
        this.useHighContrast = useHighContrast;
    }

    get background() {
        switch(this.theme) {
            case ColorSet.light: return '#FFFFFF';
            case ColorSet.dark: return '#000000';
        }
    }

    get primaryTextColor() {
        switch(this.theme) {
            case ColorSet.light: return '#000000';
            case ColorSet.dark: return '#FFFFFF';
        }
    }

    get secondaryTextColor() {
        switch(this.theme) {
            case ColorSet.light: return '#575757';
            case ColorSet.dark: return '#C4C4C4';
        }
    }

    get gridCorrectColor() {
        switch(this.theme) {
            case ColorSet.light:
                return this.useHighContrast ? '#385F35' : '#6AAA64';

            case ColorSet.dark: return '#52C447';
        }
    }
    
    get gridMisplacedColor() {
        if(this.theme == ColorSet.light && this.useHighContrast){
            return '#705100';
        }
        
        return '#FFCA43';
    }

    get gridWrongColor() {
        switch(this.theme) {
            case ColorSet.light: return '#E5E5E5';
            case ColorSet.dark: return '#4D4D4D';
        }
    }

};

ColorSet.light = Symbol();
ColorSet.dark = Symbol();

export default ColorSet;