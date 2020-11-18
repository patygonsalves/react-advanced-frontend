import { shallow } from 'enzyme'

import Item from '../components/item'

const fakeItem = {
  id: '12',
  title: 'teste item',
  price: 5000,
  description: 'teste item description',
  image: 'dog.jpg',
  largeImage: 'dogLarge.jpg',
}

describe('<Item />', () => {
  it('renders and displays images', () => {
    const wrapper = shallow(<Item item={fakeItem} />)
    expect(wrapper.find('img').props().src).toBe(fakeItem.image)
    expect(wrapper.find('img').props().alt).toBe(fakeItem.description)
  })

  it('renders and displays properly', () => {
    const wrapper = shallow(<Item item={fakeItem} />)
    const priceTag = wrapper.find('PriceTag')
    expect(priceTag.children().text()).toBe('$50')
    expect(wrapper.find('Title a').text()).toBe('teste item')
  })

  it('renders out the buttons properly', () => {
    const wrapper = shallow(<Item item={fakeItem} />)
    expect(wrapper.find('.buttonList').children()).toHaveLength(3)
    expect(wrapper.find('.buttonList').find('Link')).toHaveLength(1)
    expect(wrapper.find('.buttonList').find('Link')).toBeTruthy()
    expect(wrapper.find('.buttonList').find('DeleteItem').exists()).toBe(true)
  })

})
