import React, {ChangeEvent, useState} from 'react';
import './App.css';
import {validateMirna, transformMiarnToPrimer} from './utils';

interface Line {
  type: string
  value: string
  errors: string[]
}

const App: React.FunctionComponent = () => {
  const [primerPrefix] = useState<string>('gcggcg');
  const [primerSuffix] = useState<string>('AAAAAA');
  const [fasta, setFasta] = useState<string>('');
  const [fastaReverse, setFastaReverse] = useState<Line[] | null>();

  function setTypeOfLine(line: string): string {
    const name = new RegExp('^[>]{1}.*$');
    const seq = new RegExp('^[AUTGCautgc]+$');
    const com = new RegExp('^[;]{1}.*$');
    if (name.test(line)) {
      return 'name';
    } else if (seq.test(line)) {
      return 'sequence';
    } else if (com.test(line)) {
      return 'comment';
    } else {
      return 'unknown';
    }
  }

  /**
   * set the value of the arn
   * @param event {ChangeEvent<HTMLTextAreaElement>} the arn input event
   * @return {void} setState
   */
  function setValue(event: ChangeEvent<HTMLTextAreaElement>): void {
    const value = event.target.value;
    setFasta(value);
  }

  /**
   * handle the submit button
   * @return {void} set state
   */
  function handleSubmit(): void {
    const arrayValues = fasta.split('\n');
    const lines = [];

    for(const line in arrayValues) {
      // stock the current line & init error array
      let cline = arrayValues[line];
      let errors: string[] = [];

      // check the type
      const type = setTypeOfLine(cline);

      // if the type is a sequence transform the data
      if (type === 'sequence') {
        // check the format
        errors = validateMirna(cline);
        // if the format is ok transform the data
        if (errors.length === 0) {
          cline = transformMiarnToPrimer(cline, primerPrefix, primerSuffix)
        }
      }

      lines.push({
        type,
        value: cline,
        errors
      })
    }

    setFastaReverse(lines);
  }

  return (
    <div className="App">
      <div className="App-header">
        <textarea cols={50} rows={10} value={fasta} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setValue(event)}/>
        <button onClick={() => handleSubmit()}>Transform !</button>
        <table>
          <tbody>
            <tr>
              <td className="table-type">
                {fastaReverse && fastaReverse.map((line: Line, key:number) => (
                  <React.Fragment key={key+'typefrag'}>
                    <span className={line.errors.length > 0 ? 'error' : line.type} key={key+'typespan'}>{line.type}</span>
                    <br key={key+'typebr'}/>
                  </React.Fragment>
                ))}
              </td>
              <td className="table-value">
                {fastaReverse && fastaReverse.map((line: Line, key:number) => (
                  <React.Fragment key={key+'valuefrag'}>
                    <span className={line.errors.length > 0 ? 'error' : line.type} key={key+'valuespan'}>{line.value}</span>
                    <br key={key+'valuebr'}/>
                  </React.Fragment>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
