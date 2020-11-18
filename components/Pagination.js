import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import Head from 'next/head'
import Link from 'next/link'

import { perPage } from '../config'

import PaginationStyles from './styles/PaginationStyles'

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>
      const count = data.itemsConnection.aggregate.count
      const pages = Math.ceil(count / perPage)
      return (
        <PaginationStyles data-test='pagination'>
          <Head>
            <title>Sick Fits! {props.page} of {pages}</title>
          </Head>
          <Link prefetch href={{
            pathname: 'items',
            query: { page: props.page -1 }
          }}>
            <a className='prev' aria-disabled={props.page <= 1}>Prev</a>
          </Link>
          <p>{props.page} of <span className='totalPages'>{pages}</span></p>
          <p>{count} Items Total</p>
          <Link prefetch href={{
            pathname: 'items',
            query: { page: props.page + 1 }
          }}>
            <a className='next' aria-disabled={props.page >= pages}>Next</a>
          </Link>
        </PaginationStyles>
      )
    }}
  </Query>
)

export default Pagination
export { PAGINATION_QUERY }
