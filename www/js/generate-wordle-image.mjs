async function generateWordleImageBlob(wordle, colors){
    //  Constants

    //  Use a viewport size that's a 2:1 ratio, so we get:
    //  a. fully visible (non-cropped) images when shared on Twitter
    //  b. preserve the sort of minimal-height tweet you'd get if you shared emojis

    const viewportSize = { width: 420, height: 210 };
    const viewportHPadding = 50;

    const paddedViewportLeft = viewportHPadding;
    const paddedViewportRight = viewportSize.width - viewportHPadding;

    const scale = 4;

    //  Create and size canvas

    const canvas = document.createElement("canvas");

    canvas.width = viewportSize.width * scale;
    canvas.height = viewportSize.height * scale;

    const ctx = canvas.getContext('2d');

    //  Ensure we draw a 4x (retina) image

    ctx.scale(scale, scale);

    //  Clear

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //  Draw background

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, viewportSize.width, viewportSize.height);

    //  Draw text

    (function drawText(){
        //  Constants

        const primaryText = `${wordle.tryCount}/${wordle.availableTries}`;
        const secondaryText = `Wordle #${wordle.wordleNumber}`;

        const primaryFont = 'normal 64px Georgia';
        const secondaryFont = 'normal 18px Georgia';

        const spacing = 8;

        //  Ensure:
        //  a: measureText()'s returned descent is relative to text top
        //  b: we can position text by its top

        ctx.textBaseline = 'top';

        //  Measure
        
        ctx.font = primaryFont;

        const primaryTextMetrics = ctx.measureText(primaryText);
        const primaryTextSize = {
            width: primaryTextMetrics.width,
            height: primaryTextMetrics.actualBoundingBoxDescent
        };
        
        ctx.font = secondaryFont;

        const secondaryTextMetrics = ctx.measureText(secondaryText);
        const secondaryTextSize = {
            width: secondaryTextMetrics.width,
            height: secondaryTextMetrics.actualBoundingBoxDescent
        };

        //  Draw primary text

        const textStackHeight = (primaryTextSize.height + spacing + secondaryTextSize.height);
        
        let y = (viewportSize.height / 2) - (textStackHeight / 2);

        ctx.fillStyle = colors.primaryTextColor;
        ctx.font = primaryFont;
        ctx.fillText(primaryText, paddedViewportRight - primaryTextSize.width, y);

        y += primaryTextSize.height + spacing;

        ctx.fillStyle = colors.secondaryTextColor;
        ctx.font = secondaryFont;
        ctx.fillText(secondaryText, paddedViewportRight - secondaryTextSize.width, y);
    })();

    //  Draw grid

    (function drawGrid(){
        //  Utility for drawing rounded rectangles

        function setRoundRectPathOnCtx(x, y, width, height, radius){
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + height, radius);
            ctx.arcTo(x + width, y + height, x, y + height, radius);
            ctx.arcTo(x, y + height, x, y, radius);
            ctx.arcTo(x, y, x + width, y, radius);
            ctx.closePath();
        };

        //  Constants

        const cellSize = 20;
        const spacing = 8;

        const rowCount = wordle.guesses.length;
        const gridHeight = (cellSize * rowCount) + (spacing * (rowCount - 1));
        const origin = {
            x: paddedViewportLeft,
            y: (viewportSize.height / 2) - (gridHeight / 2)
        };

        //  Drawing

        let x = origin.x;
        let y = origin.y;

        wordle.guesses.forEach(guess => {
            const misplacedIndexes = new Set(guess.misplacedIndexes);
            const correctIndexes = new Set(guess.correctIndexes);
            
            for(let i = 1; i < (guess.totalIndexes + 1); i++){
                const isMisplaced = misplacedIndexes.has(i);
                const isCorrect = correctIndexes.has(i);
                
                let fill = colors.gridWrongColor;

                if(isMisplaced){
                    fill = colors.gridMisplacedColor;
                } else if(isCorrect){
                    fill = colors.gridCorrectColor;
                }

                const cornerRadius = isMisplaced ?
                    5: /* rounded rect */
                    cellSize / 2 /* circle */;

                setRoundRectPathOnCtx(x, y, cellSize, cellSize, cornerRadius);
                
                ctx.fillStyle = fill;
                ctx.fill();

                x += cellSize + spacing;
            }

            x = origin.x;
            y += cellSize + spacing;
        });
    })();

    //  Generate png blob

    const blob = await new Promise(resolve => {
        canvas.toBlob(blob => resolve(blob))
    });

    return blob;
};

export default generateWordleImageBlob;