import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';
import CodeFlask from '../CodeFlask';

class FormEdge extends Component {
  componentWillReceiveProps({ model, form: { setFieldsValue } }) {
    if (model.condition !== this.props.model.condition) {
      setFieldsValue({condition: model.condition})
    }
    if (model.roles !== this.props.model.roles) {
      setFieldsValue({roles: model.roles})
    }
  }

  onChange = () => {
    const { form: { validateFields }, onChange, model } = this.props;

    setTimeout(() => {
      validateFields((error, values) => {
        onChange({ ...model, ...values});
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
