import React, { Component } from 'react'
import JWT from 'jsonwebtoken'
import Form from 'react-jsonschema-form'
import Alert from '../Alert'
import Axios from '../../Lib/Common/Axios'
import * as FormHelper from '../../Lib/Helpers/Form'
import * as Session from '../../Lib/Helpers/Session'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class SignUp extends Component {

  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      key: Date.now(),
      formData: initFormData,
      alertMessage: {},
      showAlertMessage: false,
      isSigningIn: false,

    }
  }

  onSubmit({ formData }) {
    this.setState({
      key: Date.now(),
      formData: formData,
      alertMessage: {
        type: 'info',
        message: 'Signing up...'
      },
      showAlertMessage: true
    })

    const token = JWT.sign(formData, process.env.REACT_APP_API_JWT_SECRET)

    Axios
      .post(process.env.REACT_APP_API_SIGN_IN_URL, { token })
      .then(response => {
        const { token, redirect } = response.data

        Session.store({ token })

        this.setState({
          alertMessage: {
            type: 'success',
            message: 'Redirecting...'
          },
          redirect: redirect ? redirect : this.state.redirect
        })

        if (!this.state.locationState && redirect && redirect.indexOf('http') === 0)
          return window.location.href = redirect

        const _this = this

        setTimeout(function(){
          _this.setState({
            formData: initFormData,
            isSigningIn: false
          })
          _this.props.auth(true);
        }, 500)
      })
      .catch(error => {
        let message  = 'Unable to process your request. Please check your internet connection. If problem persists, contact support.'

        if (error.response && error.response.data.message)
          message = error.response.data.message

        console.log('Error: ', error)

        this.setState({
          alertMessage: {
            type: 'danger',
            message: message
          },
          showAlertMessage: true,
          isSigningIn: false
        })
      })
  }

  render() {

    return (
      <div className="form-wrapper">
        {this.state.showAlertMessage &&
          <Alert type={this.state.alertMessage.type} hideDismissButton>
            <p>{this.state.alertMessage.message}</p>
          </Alert>
        }
        <Form
          className="form"
          autocomplete="off"
          key={this.state.key}
          formData={this.state.formData}
          schema={Schema}
          uiSchema={UISchema}
          validate={validate}
          ErrorList={FormHelper.errorList}
          onSubmit={this.onSubmit}
        >
        <Button className="button__signup" basic color='orange' content='SIGN UP' type="submit"
            disabled={this.state.isSigningUp} />

        <Link className="sign__in-link"to ="/sign-in">Already a member? Click here!</Link>
        </Form>
      </div>
    )
  }
}

const initFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const Schema = {
  'type': 'object',
  'properties': {
    'firstName': {
      'type': 'string',
      'title': 'First Name'
    },
    'lastName': {
      'type': 'string',
      'title': 'Last Name'
    },
    'email': {
      'type': 'string',
      'title': 'Email'
    },
    'password': {
      'type': 'string',
      'title': 'Password'
    },
    'confirmPassword': {
      'type': 'string',
      'title': 'Confirm Password'
    }
  }
}

const UISchema = {
  'ui:rootFieldId': 'log_in',
  'firstName': {
    'ui:autofocus': true,
    'ui:placeholder': 'What is your first name?'
  },
  'lastName': {
    'ui:placeholder': 'And your last name?'
  },
  'email': {
    'ui:widget': 'email',
    'ui:placeholder': 'Enter your email'
  },
  'password': {
    'ui:widget': 'password',
    'ui:placeholder': 'Password'
  },
  'confirmPassword': {
    
    'ui:placeholder': 'Confirm your password'
  }
}

function validate(formData, errors) {
  let input

  if (formData.firstName === undefined || formData.firstName === '') {
    errors.firstName.addError('First name is required')
    input = 'firstName'
  }

  if (formData.lastName === undefined || formData.lastName === '') {
    errors.lastName.addError('Last name is required')
    input = 'lastName'
  }

  if (formData.email === undefined || formData.email === '') {
    errors.email.addError('Email is required.')
    input = 'email'
  }

  if (formData.password === undefined || formData.password === '') {
    errors.password.addError('Password is required.')
    input = input || 'password'
  }

  if (formData.confirmPassword === undefined || formData.confirmPassword === '') {
    errors.confirmPassword.addError('Confirm your password...')
    input = input || 'confirmPassword'
  }

  FormHelper.setFocus(UISchema, input)

  return errors

}