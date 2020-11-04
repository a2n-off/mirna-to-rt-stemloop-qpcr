import React, {ChangeEvent, useEffect, useState} from 'react';
import './App.css';

const App: React.FunctionComponent = () => {
  const [mirna, setMirna] = useState<string>('');
  const [primer, setPrimer] = useState<string>('');
  const [primerPrefix] = useState<string>('gcggcg');
  const [primerSuffix] = useState<string>('AAAAAA');
  const [history, setHistory] = useState<string[]>([]);
  const [errorLength, setErrorLength] = useState<string | null>();
  const [errorCharacter, setErrorCharacter] = useState<string | null>();
  const [errorEmptyValue, setErrorEmptyValue] = useState<string | null>();

  /**
   * check the mirna
   * length is between 20 & 24
   * authorized characters is ATGC | AUGC
   * @param {string} mirna the value of mirna you want to check
   * @return {void}
   */
  function validateMirna(mirna: string): void {
    const authorizedCharacters = new RegExp('^[AUTGCautgc]+$');
    if (!mirna) {
      setErrorEmptyValue('Empty value');
    } else {
      setErrorEmptyValue(null);
    }
    if (mirna.length < 20 || mirna.length > 24) {
      setErrorLength('miRNA length is between 20 and 24');
    } else {
      setErrorLength(null);
    }
    if (!authorizedCharacters.test(mirna)) {
      setErrorCharacter('Authorized characters : ATGC or AUGC');
    } else {
      setErrorCharacter(null);
    }
  }

  /**
   * set the value of the arn
   * @param event {ChangeEvent<HTMLInputElement>} the arn input event
   * @return {void} setState
   */
  function setValue(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    setMirna(value);
    setPrimer('');
    validateMirna(value);
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
   * @return {void}
   */
  function transformMiarnToPrimer(miarn: string): void {
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
    setPrimer(primer);
  }

  useEffect(() => {
    validateMirna(mirna);
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <input type="text" value={mirna} onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event)}/>
        {!(errorCharacter || errorEmptyValue || errorLength) &&
          <button onClick={() => transformMiarnToPrimer(mirna)}>Send</button>
        }
        <p>{mirna}</p>
        <p>{primer}</p>
        {(errorCharacter || errorEmptyValue || errorLength) &&
          <ul>
            {errorEmptyValue && <li>{errorEmptyValue}</li>}
            {(!errorEmptyValue && errorLength) && <li>{errorLength}</li>}
            {(!errorEmptyValue && errorCharacter) && <li>{errorCharacter}</li>}
          </ul>
        }
      </header>
    </div>
  );
}

export default App;
