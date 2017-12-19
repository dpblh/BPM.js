import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import './CodeFlaskLanguage';
import PrismCss from 'prismjs/themes/prism.css';
import Flask from './Flask';
import FlaskCss from 'CodeFlask/src/codeflask.css';
import s from './CodeFlask.css';

class CodeFlask extends Component {
  state = {};
  componentWillReceiveProps({ value }) {
    // const { code } = this.state;
    // console.log(code,value)
    // console.log(code !== value)
    this.flask.updateSilent(value);
  }
  componentDidMount() {
    const { onChange, value, lang } = this.props;
    const flask = new Flask();
    this.flask = flask;
    flask.run(this.el, { language: lang });
    this.setState({ code: value });
    flask.update(value);
    flask.onUpdate(code => {
      this.setState({ code });
      onChange && onChange(code);
      console.log(`User's input code: ${code}`);
    });
    // Prism.highlightElement(this.el);
  }

  render() {
    const { minHeight } = this.props;
    return (
      <div
        style={{ minHeight }}
        className={s.languageSimple}
        ref={el => (this.el = el)}
      />
      // <pre className={s.languageSimple}>
      //   <code ref={el => (this.el = el)}>
      //     {
      //       `
      //       if (a > 1) {
      //         setScope(a, 1)
      //       }`
      //     }
      //   </code>
      // </pre>
    );
  }
}

export default withStyles(PrismCss, FlaskCss, s)(CodeFlask);
