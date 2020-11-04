import React, {ChangeEvent, useState} from 'react';
import './App.css';

interface Line {
  type: string
  value: string
}

const App: React.FunctionComponent = () => {
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
    const arrayValues = value.split('\n');
    const lines = [];
    for(const line in arrayValues) {
      const cline = arrayValues[line];
      lines.push({
        type: setTypeOfLine(cline),
        value: cline
      })
    }
    setFasta(value);
    setFastaReverse(lines);
  }

  return (
    <div className="App">
      <div className="App-header">
        <textarea cols={50} rows={10} value={fasta} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setValue(event)}/>
        <tr>
          <td>
            {fastaReverse && fastaReverse.map((line: Line, key:number) => (
              <React.Fragment key={key+'typefrag'}>
                <span key={key+'typespan'}>{line.type}</span>
                <br key={key+'typebr'}/>
              </React.Fragment>
            ))}
          </td>
          <td>
            {fastaReverse && fastaReverse.map((line: Line, key:number) => (
              <React.Fragment key={key+'valuefrag'}>
                <span key={key+'valuespan'}>{line.value}</span>
                <br key={key+'valuebr'}/>
              </React.Fragment>
            ))}
          </td>
        </tr>
      </div>
    </div>
  );
}

export default App;
