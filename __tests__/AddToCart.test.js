import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import AddToCart, { ADD_TO_CART_MUTATION } from '../components/AddToCart'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser, fakeCartItem } from '../lib/testUtils'

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [],
        },
      },
    },
  },
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()],
        },
      },
    },
  },
  {
    request: { query: ADD_TO_CART_MUTATION, variables: { id: 'abc123' } },
    result: {
      data: {
        addToCart: {
          ...fakeCartItem(),
          quantity: 1,
        },
      }
    }
  }
]

describe('<AddToCart />', () => {
  it('renders and marches snap shot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id='abc123' />
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    expect(toJSON(wrapper.find('button'))).toMatchSnapshot()
  })

  it('changes from add to adding when clicked', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id='abc123' />
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    expect(wrapper.text()).toContain('Add to cart')
    wrapper.find('button').simulate('click')
    expect(wrapper.text()).toContain('Adding to cart')
  })

})