/**
 * make the reverse complement for one letter
 * @param {string} letter
 * @return {string} the reverse
 */
function transformTemplate(letter: string): string {
  const lowerLetter = letter.toLowerCase();
  if (lowerLetter === 'a') {
    return 't';
  } else if (lowerLetter === 't' || lowerLetter === 'u') {
    return 'a';
  } else if (lowerLetter === 'g') {
    return 'c';
  } else if (lowerLetter === 'c') {
    return 'g';
  }
  // error output
  return 'X';
}

/**
 * transform a miarn into a primer
 * @param {string} miarn the value you want to transform
 * @param {string} primerPrefix the prefix pattern for the primer
 * @param {string} primerSuffix the suffix pattern for the primer
 * @return {string} the primer fully transformed
 */
export function transformMiarnToPrimer(miarn: string, primerPrefix: string, primerSuffix: string): string {
  // the first characters - the 6 last
  const miarnPrefix = miarn.slice(0, -6);
  // 6 last characters for transformation
  const miarnSuffix = miarn.slice(-6);
  // inverse the suffix
  const reverseMiarnSuffix = miarnSuffix.split('').reverse().join("");
  // transform the suffix
  let reverse = '';
  for(const letter in reverseMiarnSuffix.split('')) {
    reverse += transformTemplate(reverseMiarnSuffix[letter]);
  }
  const primer = primerPrefix + miarnPrefix + ' - ' + primerSuffix + reverse;
  return primer;
}
