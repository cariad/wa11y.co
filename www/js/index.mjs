import ColorSet from "./color-set.mjs";
import WordleShareParsed from "./wordle-share-parsed.mjs";
import generateWordleImageBlob from "./generate-wordle-image.mjs";

//  Grab  elements

const input = document.getElementById('input');
const output = document.getElementById('output');

const useLightModeCheckbox = document.getElementById('use-light-mode-checkbox');
const useHighContrastCheckbox = document.getElementById('use-high-contrast-checkbox');

const copyImageBtn = document.getElementById('copy-image-btn');
const copyAltTextBtn = document.getElementById('copy-alt-text-btn');

//  Configure event listeners

input.addEventListener('input', () => update());

useLightModeCheckbox.addEventListener('change', () => update());
useHighContrastCheckbox.addEventListener('change', () => update());

copyImageBtn.addEventListener('click', () => copyImage());
copyAltTextBtn.addEventListener('click', () => copyAltText());

//  Main

let imageBlob;

async function update(){
    const parsedWordle = new WordleShareParsed(input.value);

    output.alt = parsedWordle.getAltText();

    const shouldUseHighContrast = useHighContrastCheckbox.checked;
    const useLightMode = useLightModeCheckbox.checked;

    const colorSet = new ColorSet(useLightMode ? ColorSet.light : ColorSet.dark, shouldUseHighContrast);

    imageBlob = await generateWordleImageBlob(parsedWordle, colorSet);

    output.src = URL.createObjectURL(imageBlob);
};

async function copyImage(){
    //  Test for clipboard support

    if(!("clipboard" in navigator)){
        alert("Your browser doesn't support automatically copying images to the clipboard. Try manually copying the image.");

        return;
    }

    //  Place blob in clipboard item

    const clipboardItem = new ClipboardItem({ [imageBlob.type]: imageBlob });

    //  Write to clipboard
    
    await navigator.clipboard.write([ clipboardItem ]);

    //  User feedback

    alert("Image copied!");
};

function copyAltText(){
    //  Create temporary, invisible element

    const temporaryElement = document.createElement("div");

    temporaryElement.contentEditable = true;
    temporaryElement.readOnly = false;
    temporaryElement.setAttribute("style", "width: 1px; height: 1px; opacity: 0.01; overflow: hidden; position: fixed;");

    temporaryElement.innerHTML = output.alt.replace(/\n/g, '<br />');

    document.body.appendChild(temporaryElement);

    //  Select temporary element

    const sel = window.getSelection();
    const newRange = document.createRange();

    newRange.selectNodeContents(temporaryElement);

    sel.removeAllRanges();
    sel.addRange(newRange);

    //  Copy

    document.execCommand("copy");

    //  Remove temporary element

    temporaryElement.parentNode.removeChild(temporaryElement);

    //  User feedback

    alert("Alt text copied!");
};

update();