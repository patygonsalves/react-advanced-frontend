import React from 'react'

import Reset from '../components/Reset'

const ResetPassword = props => (
  <div>
    <p>Reset your passoword!</p>
    <Reset resetToken={props.query.resetToken} />
  </div>
)

export default ResetPassword