import React, {ChangeEvent, useState} from 'react';
import './App.css';

const App: React.FunctionComponent = () => {
  const [mirna, setMirna] = useState<string>('');
  const [primer, setPrimer] = useState<string>('');
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
      setErrorCharacter('Authorized characters : ATGC or AUGC or atgc or augc');
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
    validateMirna(value);
  }

  /**
   *
   * @param miarn
   */
  function transformMiarnToPrimer(miarn: string) {
    //
  }

  return (
    <div className="App">
      <header className="App-header">
        <input type="text" value={mirna} onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event)}/>
        <button>Send</button>
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
