class WordleShareParsed {

    constructor(text) {
        this.guesses = [];
        this.wordleNumber = '-';
        this.tryCount = '-';
        this.availableTries = '-';

        const lines = text.split('\n');

        lines.forEach((line, lineIndex) => {
            if(lineIndex == 0){
                this.parseFirstLine(line);
            } else {
                this.parsePossibleGuessLine(line);
            }
        });
    }
  
    parseFirstLine(line) {
        const regex = /Wordle ([^\s]*) ([^\s]*)\/([^\s]*)/g;
        const results = regex.exec(line);

        if(!results || results.length != 4) return;

        this.wordleNumber = results[1];
        this.tryCount = results[2];
        this.availableTries = results[3];
    }
  
    parsePossibleGuessLine(line) {
        let actualIndex = 0;
        let visualIndex = 1;
        let totalIndexes = 0;

        const misplacedIndexes = [];
        const correctIndexes = [];

        while(actualIndex < line.length) {
            switch(line.charCodeAt(actualIndex)) {
                //  Wrong guess
                //  Dark mode:
                case 11035:
                //  Light mode:
                case 11036:
                    actualIndex += 1;
                    visualIndex += 1;
                    totalIndexes += 1;
                    break;

                case 55357:
                    switch(line.charCodeAt(actualIndex + 1)) {
                        //  Misplaced guess
                        //  High contrast:
                        case 57318:
                        //  Regular contrast:
                        case 57320:
                            misplacedIndexes.push(visualIndex++);
                            break;
                        
                        //  Correct guess
                        //  High contrast:
                        case 57319:
                        //  Regular contrast:
                        case 57321:
                            correctIndexes.push(visualIndex++);
                            break;
                        
                        default: return;
                    }

                    actualIndex += 2;
                    totalIndexes += 1;
                    
                    break;
                    
                    default: return;
            }
        }

        if(totalIndexes > 0){
            this.guesses.push({ misplacedIndexes, correctIndexes, totalIndexes });
        }
    }

    getAltText() {
        const tryCountNumber = parseInt(this.tryCount, 10);

        let text = `Wordle #${this.wordleNumber}.`;

        if(!Number.isNaN(tryCountNumber)){
            text += ` Guessed in ${tryCountNumber} tries.`;
        } else {
            text += ` All guesses incorrect.`
        }

        text += '\n';

        text += this.guesses
            .map((guess, i) => {
                if(guess.totalIndexes <= 0) return '';

                let guessDescription = `Guess #${i + 1}:`;

                if(guess.misplacedIndexes.length === 0 && guess.correctIndexes.length === 0){
                    guessDescription += ' Fully wrong.';
                } else if(guess.correctIndexes.length === guess.totalIndexes){
                    guessDescription += ' Correct word!';
                } else if(guess.misplacedIndexes.length === guess.totalIndexes){
                    guessDescription += ' All letters misplaced.';
                } else {
                    function prefixForLength(indexes){
                        const noun = indexes.length > 1 ? 'Letters' : 'Letter';

                        return ` ${noun} ${indexes.join(', ')} `;
                    };

                    if(guess.misplacedIndexes.length > 0){
                        guessDescription += prefixForLength(guess.misplacedIndexes) + 'misplaced.';
                    }

                    if(guess.correctIndexes.length > 0){
                        guessDescription += prefixForLength(guess.correctIndexes) + 'correct.';
                    }
                }

                return guessDescription;
            })
            .join('\n');

        return text;
    }
  
  };
  
  export default WordleShareParsed;