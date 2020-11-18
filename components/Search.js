import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'
import Downshift, { resetIdCounter } from 'downshift'
import debounce from 'lodash.debounce'

import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown'

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(where: {
      OR: [
        { title_contains: $searchTerm, },
        { description_contains: $searchTerm, },
      ]
    }) {
      id
      image
      title
    }
  }
`

function AutoComplete({

}){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const routeToItem = (item) => {
    Router.push({
      pathname: '/item',
      query: {
        id: item.id,
      }
    })
  }

  const handleChange = debounce(async (e, client) => {
    setLoading(true)
    
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value }
    })

    setLoading(false)
    console.log(res.data.items)
    setItems(res.data.items)
    /*setItems(res.data.items)
    console.log(res.data.items)
    console.log(items)
    console.log(loading)*/
  }, 350)

  resetIdCounter()

  console.log(loading)
  console.log(items)

  return (
    <SearchStyles>
      <Downshift onChange={routeToItem} itemToString={item => (item === null ? '' : item.title)}>
        {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
          <div>
            <ApolloConsumer>
              {client => (
                <input
                  {...getInputProps({
                    type: 'search',
                    placeholder: 'search for an item',
                    id: 'search',
                    className: loading ? 'loading' : '',
                    onChange: e => {
                      e.persist()
                      handleChange(e, client)
                    }
                  })}
                />
              )}
            </ApolloConsumer>
            {isOpen && (
              <DropDown>
                {items.map((item, index) => {
                  return (
                    <DropDownItem
                      key={item.id}
                      highlighted={index === highlightedIndex}
                      {...getItemProps({ item })}
                    >
                      <img width='50' alt={item.title} src={item.image} />
                      {item.title}
                    </DropDownItem>
                  )
                })}
                {!items.length && !loading &&
                  <DropDownItem>Nothing found {inputValue}</DropDownItem>
                }
              </DropDown>
            )}
          </div>
        )}
      </Downshift>
    </SearchStyles>
  )
}

export default AutoComplete