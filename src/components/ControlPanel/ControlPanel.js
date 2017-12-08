import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './ControlPanel.css';

class ControlPanel extends Component {
  constructor(props) {
    super();
    this.state = { show: false, tab: props.tab || 1 };
  }

  componentWillReceiveProps(props) {
    this.setState({
      tab: props.tab || 1,
      show: !!(props.node || props.link),
    });
  }

  toggleNav = () => {
    this.setState({ show: !this.state.show });
  };

  toggleTab = index => () =>
    this.setState({
      tab: index,
    });

  openScheme = scheme => () => this.props.handler.openScheme(scheme);

  render() {
    return (
      <div className={s.root}>
        <div
          className={cx({
            [s.button]: true,
            [s.toggle]: true,
            [s.show]: this.state.show,
          })}
          onClick={this.toggleNav}
        >
          <div className={s.buttonText}>x</div>
        </div>
        <div
          className={cx({
            [s.navContent]: true,
            [s.show]: this.state.show,
          })}
        >
          <div className={s.tabs}>
            <div
              className={cx(s.button, this.state.tab === 0 ? s.activeTab : '')}
              onClick={this.toggleTab(0)}
            >
              <div className={s.buttonText}>Подсказки</div>
            </div>
            <div
              className={cx(s.button, this.state.tab === 1 ? s.activeTab : '')}
              onClick={this.toggleTab(1)}
            >
              <div className={s.buttonText}>Управление</div>
            </div>
          </div>

          <div
            className={cx(s.content, this.state.tab === 0 ? s.showContent : '')}
          >
            1
          </div>
          <div
            className={cx(s.content, this.state.tab === 1 ? s.showContent : '')}
          >
            <div className={s.groupButton}>
              <div
                className={cx(s.button, s.control)}
                onClick={this.props.handler.saveSheme}
              >
                <div className={s.buttonText}>Save</div>
              </div>
              <div className={cx(s.button, s.control)}>
                <div className={s.buttonText}>Clear</div>
              </div>
              <div className={cx(s.button, s.control)}>
                <div className={s.buttonText}>New</div>
              </div>
            </div>
            <div className={s.groupButtonLabel}>Statements</div>
            <div className={s.groupButton}>
              {this.props.schemes.map(schem => (
                <div
                  className={cx(s.button, s.control, 'drag-me')}
                  id={schem.id}
                  onDoubleClick={this.openScheme(schem)}
                >
                  <div className={s.buttonText}>{schem.name}</div>
                </div>
              ))}
              {/* <div className={cx(s.button, s.control, 'drag-me')}> */}
              {/* <div className={s.buttonText}>Управление</div> */}
              {/* </div> */}
              {/* <div className={cx(s.button, s.control, 'drag-me')}> */}
              {/* <div className={s.buttonText}>Управление</div> */}
              {/* </div> */}
              {/* <div className={cx(s.button, s.control, 'drag-me')}> */}
              {/* <div className={s.buttonText}>Управление</div> */}
              {/* </div> */}
              {/* <div className={cx(s.button, s.control, 'drag-me')}> */}
              {/* <div className={s.buttonText}>Управление</div> */}
              {/* </div> */}
            </div>
          </div>

          <div
            className={cx(s.content, this.state.tab === 2 ? s.showContent : '')}
          >
            {JSON.stringify(this.props.node)}
          </div>
          <div
            className={cx(s.content, this.state.tab === 3 ? s.showContent : '')}
          >
            {JSON.stringify(this.props.link)}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ControlPanel);
