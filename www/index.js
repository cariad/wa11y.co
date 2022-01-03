// const copy = document.getElementById('copy');
// copy.addEventListener('click', () => {
//   navigator.clipboard.writeText(output.value);
// });

const tweet = document.getElementById('tweet');
tweet.addEventListener('click', () => {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURI(output.value)}`);
});

const input = document.getElementById('input');
const output = document.getElementById('output');

const describe = (indexes) => {
  if (indexes.length === 0) return null;

  const ords = indexes.map((i) => ord(i));

  if (ords.length === 1) return ords[0];

  return ords.reduce(
    (text, value, i, array) => {
      return text + (i < array.length - 1 ? ', ' : ' and ') + value;
    })
};

const describeLine = (line, num) => {
  const decoded = blockTypes(line);

  const hasPerfect = decoded.perfectIndexes.length > 0;
  const hasMisplaced = decoded.misplacedIndexes.length > 0;

  const perfect = hasPerfect ? `${describe(decoded.perfectIndexes)} perfect` : null;

  const misplacedList = describe(decoded.misplacedIndexes);

  const misplaced = hasPerfect ? `, but ${misplacedList} in the wrong place` : `${misplacedList} correct but in the wrong place`;

  let explanation = '';

  if (!hasPerfect && !hasMisplaced)
    explanation = 'nothing.';
  else if (decoded.perfectIndexes.length === 5)
    explanation = 'got it!';
  else if (decoded.misplacedIndexes.length === 5)
    explanation = 'all the correct letters but in the wrong order.';
  else if (hasPerfect && hasMisplaced)
    explanation = `${perfect}${misplaced}.`
  else if (hasMisplaced)
    explanation = `${misplaced}.`
  else
    explanation = `${perfect}!`

  output.value += `Line ${num}: ${explanation}\n`;
}

const ord = (i) => {
  switch (i) {
    case 1: return '1st';
    case 2: return '2nd';
    case 3: return '3rd';
    default: return `${i}th`
  }
}

const blockTypes = (line) => {
  let actualIndex = 0;
  let visualIndex = 1;

  const misplacedIndexes = [];
  const perfectIndexes = [];

  while (actualIndex < line.length) {
    switch (line.charCodeAt(actualIndex)) {
      // Dark mode:
      case 11035:
      // Light mode:
      case 11036:
        actualIndex += 1;
        visualIndex += 1;
        break;
      case 55357:
        switch (line.charCodeAt(actualIndex + 1)) {
          // High contrast:
          case 57318:
          // Regular contrast:
          case 57320:
            misplacedIndexes.push(visualIndex++);
            break;
          // High contrast:
          case 57319:
          // Regular contrast:
          case 57321:
            perfectIndexes.push(visualIndex++);
            break;
          default:
            // console.log('color', line[visualIndex], line.charCodeAt(actualIndex+1));
            return undefined;
        }
        actualIndex += 2;
        break;
      default:
        // console.log(line[visualIndex], line.charCodeAt(actualIndex));
        return undefined;
    }
  }

  return {
    misplacedIndexes: misplacedIndexes,
    perfectIndexes: perfectIndexes,
  };
}

const isGameLine = (line) => {
  return line && line.length > 0 && blockTypes(line) !== undefined;
}

input.addEventListener('input', () => {
  output.value = '';
  const lines = input.value.split('\n');
  const gameLines = [];

  lines.forEach((line) => {
    if (isGameLine(line)) {
      gameLines.push(line);
      describeLine(line, gameLines.length);
    }
    else
      output.value += `${line}\n`;
  });

  output.value += '\n';

  gameLines.forEach((line) => {
    output.value += `${line}\n`;
  });

  output.value = output.value.trim();
});
