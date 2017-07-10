import React from 'react'
import { connect } from 'react-redux'
import { TransitionGroup, Transition } from 'transition-group'
import universal from 'react-universal-component'
import '../css/Switcher.css'

const Switcher = ({ page, direction, isLoading }) =>
  <TransitionGroup
    className={`switcher ${direction}`}
    duration={500}
    prefix='slide'
  >
    <Transition key={page}>
      <UniversalComponent page={page} isLoading={isLoading} />
    </Transition>
  </TransitionGroup>

const isListFetching = (page, videosByCategory) => {
  const { category, categories } = videosByCategory
  return page === 'List' && !categories[category]
}

const mapState = ({ page, direction, videosByCategory }) => {
  const isLoading = isListFetching(page, videosByCategory)
  return { page, direction, isLoading }
}

export default connect(mapState)(Switcher)

const UniversalComponent = universal(props => import(`./${props.page}`), {
  chunkName: props => props.page,
  minDelay: 500,
  loading: () => <div className='spinner'><div /></div>,
  error: () => <div className='notFound'>PAGE NOT FOUND - 404</div>
})

// This is obviously a very powerful pair of components. It's where Redux shines
// in all its glory. The core is hashing on a component name in a reducer.
//
// What's going on here is:
//
// 1. We're hashing on the `page` prop via the `page` reducer
// which has access to a simple hash of action types to component names. 
//
// 2. We're passing this one prop down through a <TransitionGroup /> which knows how
// to animate in and out 2 separate components via a simple declarative definition
// (for a single component at a time--NICE!).
//
// 3. We're using the same sort of technique with react-universal-component, which
// also knows how to switch components based on a hash. (Any component in the `./`
// directory is essentially hashed by its name).
//
// CONCLUSION: 
// Hashing on action types to component names gets a lot of "bang for your buck"!
// This isn't just easy. It's flexible. You haven't made any tradeoffs in capabilities.