import React, {ChangeEvent, ReactNode, useState} from 'react';
import {
  validateMirna,
  transformMiarnToPrimer,
  Line,
  ExampleDataTransformed,
  ExampleDataInput
} from '../utils/utils';
import {Button, Icon, Label, Container, Form, TextArea, Placeholder, Table} from 'semantic-ui-react';

const App: React.FunctionComponent = () => {
  const [primerPrefix] = useState<string>('GCGGCG');
  const [primerSuffix] = useState<string>('GTCGTATCCAGTGCAGGGTCCGAGGTATTCGCACTGGATACGAC');
  const [fasta, setFasta] = useState<string>('');
  const [fastaReverse, setFastaReverse] = useState<Line[] | null>();
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * set the type of each line
   * @param {string} line the line you want to define the type
   * @return {Line['type']} the type object
   */
  function setTypeOfLine(line: string): Line['type'] {
    const header = new RegExp('^[>]{1}.*$');
    const seq = new RegExp('^[AUTGCautgc]+$');
    const com = new RegExp('^[;]{1}.*$');
    const sdl = new RegExp('^$');
    if (header.test(line)) {
      return {name: 'header', color: 'teal'};
    } else if (seq.test(line)) {
      return {name: 'sequence', color: 'violet'};
    } else if (com.test(line)) {
      return {name: 'comment', color: 'purple'};
    } else if (sdl.test(line)) {
      return {name: '', color: undefined};
    } else {
      return {name: 'unknown', color: 'grey'};
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
    setLoading(true);
    const arrayValues = fasta.split('\n');
    const lines: Line[] = [];

    for(const line in arrayValues) {
      // stock the current line & init error array
      let cline = arrayValues[line];
      let errors: string[] = [];
      let customName = undefined;

      // check the type
      const type = setTypeOfLine(cline);

      // if the type is a sequence transform the data
      if (type.name === 'sequence') {
        // check the format
        errors = validateMirna(cline);
        // if the format is ok transform the data
        if (errors.length === 0) {
          cline = transformMiarnToPrimer(cline, primerPrefix, primerSuffix)
        }
        // set custom name for sequence
        // parseInt is here because typescript linter consider line as a string
        const previousLine = lines[parseInt(line, 10) - 1];
        if (previousLine && previousLine.type.name === 'header') {
          // without the >
          const cnHead = previousLine.value.split('>')[1];
          // without the comment
          const cnComment = cnHead.trim().split(' ')[0];
          customName = '_' + cnComment.slice(1);
        } else {
          customName = '';
        }
      }

      lines.push({
        type,
        customName,
        value: cline,
        errors
      })
    }
    setFastaReverse(lines);
    setLoading(false);
  }

  /**
   * map the color for each character
   * @param {string} value primer rt | primer qpcr | mirna
   * @param {'rt' | 'qpcr' | undefined} type the type of primer
   * @return {ReactNode}
   */
  function mapColor(value: string, type: string | undefined): ReactNode {
    console.log(value);
    // lower case & array
    if (value) {
      let tmpValue = value;
      if (type === 'rt') {
        tmpValue = value.slice(6);
      } else if (type === 'qpcr') {
        tmpValue = value.slice(45);
      }
      const arrayValue = tmpValue.toUpperCase().split('');
      return (
        <React.Fragment>
          {mapPrefix(type)}
          {arrayValue.map((value: string, index: number) => (
            <React.Fragment key={index+'card'}>
              {(value === 'G') && <span className="card bg-red">G</span>}
              {(value === 'T' || value === 'U') && <span className="card bg-yellow">T</span>}
              {(value === 'A') && <span className="card bg-orange">A</span>}
              {(value === 'C') && <span className="card bg-blue">C</span>}
            </React.Fragment>
            ))
          }
        </React.Fragment>
      )
    }
  }

  /**
   * generate the prefix for each sequence
   * @param {string | undefined} type the type of the sequence
   * @return {ReactNode | undefined} the prefix or nothing
   */
  function mapPrefix(type: string | undefined): ReactNode | undefined {
    const rt = primerPrefix.toUpperCase().split('');
    const qpcr = primerSuffix.toUpperCase().split('');
    if (type === 'rt') {
      return (
        <span className="nested">
          {rt.map((value: string) => (
            mapColor(value, undefined)
          ))}
        </span>
      )
    } else if (type === 'qpcr') {
      return (
        <span className="nested">
          {qpcr.map((value: string) => (
            mapColor(value, undefined)
          ))}
        </span>
      )
    }
    return undefined;
  }

  /**
   * set example data
   * @return {void} setstate
   */
  function setExampleData(): void {
    setFastaReverse(ExampleDataTransformed());
    setFasta(ExampleDataInput());
  }

  return (
    <Container className="app">

      <Form>
        <TextArea rows={5} value={fasta} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setValue(event)} />
      </Form>

      <Button animated onClick={() => handleSubmit()}>
        <Button.Content visible>Transform</Button.Content>
        <Button.Content hidden>
          <Icon name='arrow right' />
        </Button.Content>
      </Button>

      <Button animated onClick={() => setExampleData()}>
        <Button.Content visible>Example data</Button.Content>
        <Button.Content hidden>
          <Icon name='arrow right' />
        </Button.Content>
      </Button>

      <Button animated>
        <Button.Content visible>Save</Button.Content>
        <Button.Content hidden>
          <Icon name='arrow right' />
        </Button.Content>
      </Button>

      {loading &&
        <Placeholder>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder>
      }

      <Table celled inverted selectable>
        <Table.Body>
          {(!loading && fastaReverse) && fastaReverse.map((line: Line, key:number) => (
            (line.type.name === 'sequence' && line.errors.length === 0) ?
              <React.Fragment key={key}>
                <Table.Row>
                  <Table.Cell>
                    <Label ribbon color={line.type.color} horizontal>
                      primerRT {line.customName ? line.customName : line.type.name}
                    </Label>
                  </Table.Cell>
                  <Table.Cell>
                    {mapColor(line.value.split('-')[0], 'rt')}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    <Label ribbon color={line.type.color} horizontal>
                      primerqPCR-Fwd {line.customName ? line.customName : line.type.name}
                    </Label>
                  </Table.Cell>
                  <Table.Cell>
                    {mapColor(line.value.split('-')[1], 'qpcr')}
                  </Table.Cell>
                </Table.Row>
              </React.Fragment> :

              <Table.Row>
                <Table.Cell>
                  <Label ribbon color={line.type.color} horizontal>
                    {line.type.name}
                  </Label>
                </Table.Cell>
                <Table.Cell error={(line.type.name === 'unknown' || line.errors.length > 0)}>
                  {(line.type.name === 'unknown' || line.errors.length > 0) && <Icon name='attention' />}
                  <span className={(line.type.name === 'unknown' || line.errors.length > 0) ? 'c-red' : ''}>
                    {line.value}
                    {line.errors.length > 0 &&
                    <i>
                      {line.errors.map((value: string) => (
                        ' error(s) : ' + value + ' '
                      ))}
                    </i>
                    }
                  </span>
                </Table.Cell>
              </Table.Row>
          ))}

        </Table.Body>
      </Table>

    </Container>
  );
}

export default App;
