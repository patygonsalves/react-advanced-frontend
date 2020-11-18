import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import RemoveFromCart, { REMOVE_FROM_CART_MUTATION } from '../components/RemoveFromCart'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser, fakeCartItem } from '../lib/testUtils'
import { ApolloConsumer } from 'react-apollo'

global.alert = jest.fn()

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [ fakeCartItem({ id: 'abc123' })]
        }
      }
    }
  }, 
  {
    request: {
      query: REMOVE_FROM_CART_MUTATION,
      varibles: { id: 'abc123' },
    },
    result: {
      data: {
        removeFromCart: {
          __typename: 'CartItem',
          id: 'abc123',
        }
      }
    }
  }
]

describe('<RemoveFromCart />', () => {
  it('renders and marches snapshot',() => {
    const wrapper = mount(
      <MockedProvider>
        <RemoveFromCart id='abc123' />
      </MockedProvider>
    )

    expect(toJSON(wrapper.find('button'))).toMatchSnapshot()
  })

  /*it('removes the item from cart', async () => {
    let apolloClient

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client
            return <RemoveFromCart id='abc123' />
          }}
        </ApolloConsumer>
      </MockedProvider>
    )

    const res = await apolloClient.query({ query: CURRENT_USER_QUERY  })
    expect(res.data.me.cart).toHaveLength(1)
    expect(res.data.me.cart[0].price).toBe(5000)
    wrapper.find('button').simulate('click')

    await wait()
    const res2 = await apolloClient.query({ query: CURRENT_USER_QUERY  })
    expect(res.data.me.cart).toHaveLength(0)
  })*/

})


