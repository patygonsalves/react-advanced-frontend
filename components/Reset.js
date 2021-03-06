import React, { Component } from 'react'

import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

import { CURRENT_USER_QUERY } from './User'

import Form from './styles/Form'
import Error from './ErrorMessage'

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
      id
      name
      email
    }
  }
`

class Reset extends Component {

  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  }

  state = {
    password: '',
    confirmPassword: '',
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {

    const { password, confirmPassword } = this.state

    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          password,
          confirmPassword,
        }}
        refetchQueries={[{
          query: CURRENT_USER_QUERY,
        }]}
      >
        {(reset, { error, loading}) => (
          <Form
            method='post'
            onSubmit={async e => {
              e.preventDefault()
              await reset()
              this.setState({ password: '', confirmPassword: '' })
            }}
          >
          <fieldset disabled={loading} aria-busy={loading}>
            <h2>Reset a password</h2>
            <Error error={error} />
            <label htmlFor='password'>
              Password
              <input
                type='password'
                name='password'
                placeholder='Password'
                value={password}
                onChange={this.saveToState}
              />
            </label>
            <label htmlFor='password'>
              Confirm Your Password
              <input
                type='password'
                name='confirmPassword'
                placeholder='Confirm Your Password'
                value={confirmPassword}
                onChange={this.saveToState}
              />
            </label>
            <button type='submit'>Reset your password!</button>
          </fieldset>
        </Form>
        )}
      </Mutation>
    )
  }
}

export default Reset