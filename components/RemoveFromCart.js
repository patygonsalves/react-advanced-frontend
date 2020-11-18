import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { CURRENT_USER_QUERY } from './User'

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover{
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`
const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

function RemoveFromCart({
  id,
}) {


  const update = (cache, payload) => {
    // 1. read the cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY })
    // 2. remove that item from the cart
    const cartItemId = payload.data.removeFromCart.id
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId)
    // 3. write it back to the cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data })
  }

  return (
    <Mutation
      mutation={REMOVE_FROM_CART_MUTATION}
      variables={{ id }}
      update={update}
      optimisticResponse={{
        __typename: 'Mutation',
        removeFromCart: {
          __typename: 'CartItem',
          id,
        },
      }}
    >
      {(removeFromCart, { loading, error}) => (
        <BigButton
          onClick={() => {
            removeFromCart().catch(err => alert(err.message))
          }}
          title='Delete item'
          disabled={loading}
        >&times;</BigButton>
      )}
    </Mutation>  )
}

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired,
}

export default RemoveFromCart
export { REMOVE_FROM_CART_MUTATION }