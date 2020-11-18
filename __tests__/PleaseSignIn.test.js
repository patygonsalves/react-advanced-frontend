import wait from 'waait'
import { CURRENT_USER_QUERY} from '../components/User'
import PleaseSignIn from '../components/PleaseSignIn'
import { MockedProvider } from 'react-apollo/test-utils'
import { fakeUser } from '../lib/testUtils'
import { mount } from 'enzyme'

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } },
  }
]

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } },
  }
]

describe('<PleaseSignIn />', async () => {
  it('renders the sign in dialog to logged outusers', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    expect(wrapper.text()).toContain('Please Sign In before Continue')
    expect(wrapper.find('Signin').exists()).toBe(true)
  })

  it('renders the child component when the user is signed in', async () => {
    const Hey = () => <p>Hey</p>
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignIn>
          <Hey />
        </PleaseSignIn>
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    expect(wrapper.find('Hey').exists()).toBe(true)
  })
})