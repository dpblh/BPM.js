import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';
import CodeFlask from '../CodeFlask';

class FormEdge extends Component {
  componentWillReceiveProps({ model, form: { setFieldsValue } }) {
    if (model.condition !== this.props.model.condition) {
      setFieldsValue({ condition: model.condition });
    }
    if (model.roles !== this.props.model.roles) {
      setFieldsValue({ roles: model.roles });
    }
    if (model.immediate !== this.props.model.immediate) {
      setFieldsValue({ immediate: model.immediate });
    }
  }

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
        <div className="title-comment token comment">/*Условие перехода*/</div>
        <CodeFlask
          {...{ lang: 'condition', minHeight: 100 }}
          {...getFieldProps('condition', {
            onChange: this.onChange,
            initialValue: model.condition || '',
            rules: [],
          })}
        />
        <div className="title-comment token comment">/*Правила*/</div>
        <CodeFlask
          {...{ lang: 'roles', minHeight: 200 }}
          {...getFieldProps('roles', {
            onChange: this.onChange,
            initialValue: model.roles || '',
            rules: [],
          })}
        />
        <label className="title-comment token comment">
          /*immediate*/&nbsp;
          <input
            type="checkbox"
            {...getFieldProps('immediate', {
              onChange: this.onChange,
              initialValue: model.immediate || false,
              valuePropName: 'checked',
              rules: [],
            })}
          />
        </label>
      </div>
    );
  }
}

FormEdge.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  model: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default createForm()(FormEdge);
