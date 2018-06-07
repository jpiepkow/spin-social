import React, { Component } from 'react';
import NlSelect from './nlSelect';
import NlText from './nlText';
const reactStringReplace = require('react-string-replace');


export default class nlForm extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    this.newSentence = this.props.sentence;
    getWordsBetweenCurlies(this.props.sentence).forEach((x, index) => {
      this.newSentence = reactStringReplace(
        this.newSentence,
        `{${x}}`,
        (match, i) =>
          this.props.clicked[x]
            ? <NlSelect
              key={index}
              select={this.props.select[x]}
              changeDefault={this.props.changeDefault}
              text={getSelected(this.props.select[x])}
              selectName={x}
            />
            : <NlText
              key={index}
              text={getSelected(this.props.select[x])}
              selectName={x}
              click={this.props.onPress}
            />
      );
    });
    return (
      <form id="nl-form marg-top" className="nl-form">
        {this.newSentence}
        <br />
        <div style={{ paddingTop: '30px' }}>
          <a
            style={{ backgroundColor: '#6D15E6', color: 'white' }}
            onClick={this.props.onSub.bind(this)}
            className="button button-pill button-giant"
          >
            <p className="lt">SUBMIT</p>
          </a>
        </div>
      </form>
    );
  }
}
function getSelected(arr) {
  return arr.filter(x => x.selected)[0].value;
}
function getWordsBetweenCurlies(str) {
  var results = [], re = /{([^}]+)}/g, text;

  while (text = re.exec(str)) {
    results.push(text[1]);
  }
  return results;
}
