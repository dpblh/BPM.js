import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './ControlPanel.css';
import CodeFlask from '../CodeFlask';
import { createForm } from 'rc-form';

class SchemeForm extends Component {
  onChange = () => {
    const { form: { validateFields }, changeScheme } = this.props;

    setTimeout(() => {
      validateFields((error, { name, desc }) => {
        changeScheme({ name, desc });
      });
    });
  };

  componentWillReceiveProps({ scheme, form: { setFieldsValue } }) {
    if (scheme !== this.props.scheme) {
      setFieldsValue({
        name: scheme.name,
        desc: scheme.desc,
      });
    }
  }

  render() {
    const { form: { getFieldProps }, scheme } = this.props;
    return (
      <div>
        <div className="title-comment token comment">/*Название*/</div>
        <CodeFlask
          {...{ lang: 'planeText', minHeight: 100 }}
          {...getFieldProps('name', {
            onChange: this.onChange,
            initialValue: scheme.name,
            rules: [],
          })}
        />
        {/* <input */}
        {/* {...getFieldProps('name', { */}
        {/* onChange: this.onChange, */}
        {/* initialValue: scheme.name, */}
        {/* rules: [{ required: true }], */}
        {/* })} */}
        {/* /> */}
        <div className="title-comment token comment">/*Описание*/</div>
        <CodeFlask
          {...{ lang: 'planeText', minHeight: 200 }}
          {...getFieldProps('desc', {
            onChange: this.onChange,
            initialValue: scheme.desc,
            rules: [],
          })}
        />
        {/* <input */}
        {/* {...getFieldProps('desc', { */}
        {/* onChange: this.onChange, */}
        {/* initialValue: scheme.desc, */}
        {/* rules: [{ required: true }], */}
        {/* })} */}
        {/* /> */}
      </div>
    );
  }
}

const SchemeForms = createForm()(SchemeForm);

class NodeForm extends Component {
  onChangeStart = event => {
    if (event.target.checked === false) {
      event.target.checked = true;
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.onChange(event);
  };
  onChange = () => {
    const { form: { validateFields }, node } = this.props;

    setTimeout(() => {
      validateFields((error, { name, desc, startNode }) => {
        node.attr('data/name', name);
        node.attr('data/desc', desc);
        node.attr('data/startNode', startNode);
      });
    });
  };

  componentWillReceiveProps({ node, form: { setFieldsValue } }) {
    if (node !== this.props.node) {
      setFieldsValue({
        name: node.attr('data/name') || '',
        desc: node.attr('data/desc') || '',
        startNode: node.attr('data/startNode'),
      });
    }
  }

  render() {
    const { form: { getFieldProps }, node } = this.props;
    return (
      <div>
        <div className="title-comment token comment">/*Название*/</div>
        <CodeFlask
          {...{ lang: 'planeText', minHeight: 100 }}
          {...getFieldProps('name', {
            onChange: this.onChange,
            initialValue: node.attr('data/name') || '',
            rules: [],
          })}
        />
        {/* <input */}
        {/* {...getFieldProps('name', { */}
        {/* onChange: this.onChange, */}
        {/* initialValue: node.attr('data/name') || '', */}
        {/* rules: [{ required: true }], */}
        {/* })} */}
        {/* /> */}
        <div className="title-comment token comment">/*Описание*/</div>
        <CodeFlask
          {...{ lang: 'planeText', minHeight: 200 }}
          {...getFieldProps('desc', {
            onChange: this.onChange,
            initialValue: node.attr('data/desc') || '',
            rules: [],
          })}
        />
        {/* <input */}
        {/* {...getFieldProps('desc', { */}
        {/* onChange: this.onChange, */}
        {/* initialValue: node.attr('data/desc') || '', */}
        {/* rules: [{ required: true }], */}
        {/* })} */}
        {/* /> */}
        <label className="title-comment token comment">
          /*Стартовый узел*/&nbsp;
          <input
            type="checkbox"
            {...getFieldProps('startNode', {
              onChange: this.onChangeStart,
              initialValue: node.attr('data/startNode'),
              valuePropName: 'checked',
              rules: [],
            })}
          />
        </label>
      </div>
    );
  }
}

const NodeForms = createForm()(NodeForm);

class EdgeForm extends Component {
  onChange = () => {
    const { form: { validateFields }, link } = this.props;

    setTimeout(() => {
      validateFields((error, { roles, condition }) => {
        link.attr('data/roles', roles);
        link.attr('data/condition', condition);
      });
    });
  };

  componentWillReceiveProps({ link, form: { setFieldsValue } }) {
    if (link !== this.props.link) {
      setFieldsValue({
        roles: link.attr('data/roles') || '',
        condition: link.attr('data/condition') || '',
      });
    }
  }

  render() {
    const { form: { getFieldProps }, link } = this.props;
    return (
      <div>
        <div className="title-comment token comment">/*Условие перехода*/</div>
        <CodeFlask
          {...{ lang: 'condition', minHeight: 100 }}
          {...getFieldProps('condition', {
            onChange: this.onChange,
            initialValue: link.attr('data/condition') || '',
            rules: [],
          })}
        />
        <div className="title-comment token comment">/*Правила*/</div>
        <CodeFlask
          {...{ lang: 'roles', minHeight: 200 }}
          {...getFieldProps('roles', {
            onChange: this.onChange,
            initialValue: link.attr('data/roles') || '',
            rules: [],
          })}
        />
      </div>
    );
  }
}

const EdgeForms = createForm()(EdgeForm);

class ControlPanel extends Component {
  toggleNav = () => this.props.handler.toggleMenu();

  toggleTab = index => () => this.props.handler.toggleTab(index);

  openScheme = scheme => () => this.props.handler.openScheme(scheme);

  render() {
    const {
      node,
      link,
      scheme,
      showMenu,
      handler: { changeScheme },
      showHistory,
    } = this.props;
    return (
      <div className={s.root}>
        <div
          className={cx({
            [s.button]: true,
            [s.toggle]: true,
            [s.show]: showMenu,
          })}
          onClick={this.toggleNav}
        >
          <div className={s.buttonText}>x</div>
        </div>
        <div
          className={cx({
            [s.navContent]: true,
            [s.show]: showMenu,
          })}
        >
          <div className={s.tabs}>
            <div
              className={cx(s.button, this.props.tab === 0 ? s.activeTab : '')}
              onClick={this.toggleTab(0)}
            >
              <div className={s.buttonText}>Подсказки</div>
            </div>
            <div
              className={cx(s.button, this.props.tab === 1 ? s.activeTab : '')}
              onClick={this.toggleTab(1)}
            >
              <div className={s.buttonText}>Управление</div>
            </div>
          </div>

          <div
            className={cx(s.content, this.props.tab === 0 ? s.showContent : '')}
          >
            1
          </div>
          <div
            className={cx(s.content, this.props.tab === 1 ? s.showContent : '')}
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
              <div
                className={cx(s.button, s.control)}
                onClick={this.props.handler.showHistoryHandler}
              >
                <div className={s.buttonText}>{ showHistory ? 'History Hide' : 'History Show' }</div>
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
            </div>
          </div>

          <div
            className={cx(s.content, this.props.tab === 2 ? s.showContent : '')}
          >
            {node && <NodeForms {...{ node, scheme }} />}
            {/* {JSON.stringify(this.props.node)} */}
          </div>
          <div
            className={cx(s.content, this.props.tab === 3 ? s.showContent : '')}
          >
            {link && <EdgeForms {...{ link }} />}
            {/* {JSON.stringify(this.props.link)} */}
          </div>

          <div
            className={cx(s.content, this.props.tab === 4 ? s.showContent : '')}
          >
            {scheme && <SchemeForms {...{ scheme, changeScheme }} />}
            {/* {JSON.stringify(this.props.link)} */}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ControlPanel);
