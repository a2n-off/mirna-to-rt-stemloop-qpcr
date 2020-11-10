/**
 * check the mirna
 * length is between 20 & 24
 * authorized characters is ATGC | AUGC
 * @param {string} mirna the value of mirna you want to check
 * @return {string[]} array of error
 */
export function validateMirna(mirna: string): string[] {
  const authorizedCharacters = new RegExp('^[AUTGCautgc]+$');
  const errors = [];
  if (!mirna) {
    errors.push('Empty value');
  }
  if (mirna.length < 20 || mirna.length > 24) {
    errors.push('miRNA length is between 20 and 24');
  }
  if (!authorizedCharacters.test(mirna)) {
    errors.push('Authorized characters : ATGC or AUGC');
  }
  return errors;
}

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

export interface Line {
  type: {
    name: string
    color?: 'red' | 'orange' | 'yellow' | 'olive' | 'green' | 'teal' | 'blue' | 'violet' | 'purple' | 'pink' | 'brown' | 'grey' | 'black' | undefined
  }
  customName?: undefined | string
  value: string
  errors: string[]
}

/**
 * return a set of example data for the input
 * @return {string} the example data
 */
export function ExampleDataInput(): string {
  return '> line break\n' +
    '\n' +
    '> value that looks like nothing\n' +
    'qwerty12345\n' +
    '> Error on a value that looks like a miRNA\n' +
    'UCACCGG\n' +
    '> cel-miR-36-3p MIMAT0000007 Caenorhabditis elegans miR-36-3p\n' +
    'UCACCGGGUGAAAAUUCGCAUG'
}
