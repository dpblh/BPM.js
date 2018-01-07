import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';
import CodeFlask from '../CodeFlask';

class FormScheme extends Component {
  componentWillReceiveProps({ model, form: { setFieldsValue } }) {
    if (model.name !== this.props.model.name) {
      setFieldsValue({ name: model.name });
    }
    if (model.desc !== this.props.model.desc) {
      setFieldsValue({ desc: model.desc });
    }
    if (model.removed !== this.props.model.removed) {
      setFieldsValue({ removed: model.removed });
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
        <div className="title-comment token comment">/*Название*/</div>
        <CodeFlask
          {...{ lang: 'planeText', minHeight: 100 }}
          {...getFieldProps('name', {
            onChange: this.onChange,
            initialValue: model.name,
            rules: [],
          })}
        />
        <div className="title-comment token comment">/*Описание*/</div>
        <CodeFlask
          {...{ lang: 'planeText', minHeight: 200 }}
          {...getFieldProps('desc', {
            onChange: this.onChange,
            initialValue: model.desc,
            rules: [],
          })}
        />
        <label className="title-comment token comment">
          /* Пометить для удаления*/&nbsp;
          <input
            type="checkbox"
            {...getFieldProps('removed', {
              onChange: this.onChange,
              initialValue: model.removed,
              valuePropName: 'checked',
              rules: [],
            })}
          />
        </label>
      </div>
    );
  }
}

FormScheme.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  model: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default createForm()(FormScheme);
