import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';
import CodeFlask from '../CodeFlask';

class FormNode extends Component {
  componentWillReceiveProps({ model, form: { setFieldsValue, setFields } }) {
    if (model.name !== this.props.model.name) {
      setFieldsValue({name: model.name})
    }
    if (model.desc !== this.props.model.desc) {
      setFieldsValue({desc: model.desc})
    }
    if (model.startNode !== this.props.model.startNode) {
      setFieldsValue({startNode: model.startNode})
    }
  }
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
    const { form: { validateFields }, onChange, model } = this.props;

    setTimeout(() => {
      validateFields((error, values) => {
        onChange({ ...model, ...values });
      });
    });
  };

  render() {
    const { form: { getFieldProps }, model } = this.props;
    return (
      <div>
        <div className="title-comment token comment">/*Название*/</div>
        <CodeFlask
          {...{ lang: 'planeText', minHeight: 100 }}
          {...getFieldProps('name', {
            onChange: this.onChange,
            initialValue: model.name || '',
            rules: [],
          })}
        />
        <div className="title-comment token comment">/*Описание*/</div>
        <CodeFlask
          {...{ lang: 'planeText', minHeight: 200 }}
          {...getFieldProps('desc', {
            onChange: this.onChange,
            initialValue: model.desc || '',
            rules: [],
          })}
        />
        <label className="title-comment token comment">
          /*Стартовый узел*/&nbsp;
          <input
            type="checkbox"
            {...getFieldProps('startNode', {
              onChange: this.onChangeStart,
              initialValue: model.startNode || false,
              valuePropName: 'checked',
              rules: [],
            })}
          />
        </label>
      </div>
    );
  }
}

FormNode.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  model: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default createForm()(FormNode);
