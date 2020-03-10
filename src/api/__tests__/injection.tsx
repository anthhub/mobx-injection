import injection from '../injection'
import injectedComponent from '../injectedComponent'
import store from '../store'
import * as React from 'react'
import '@testing-library/jest-dom'
import { render, act } from '@testing-library/react'
class CounterStoreType {
  counter = 0
  increment = () => {
    this.counter++
  }
}

describe('injection and injectedComponent', () => {
  let StoreApplication: any
  let StoreSession: any

  beforeEach(() => {
    @store('application')
    class CounterStore {
      counter = 0
      increment = () => {
        this.counter++
      }
    }

    @store('session')
    class CounterStore1 {
      counter = 0
      increment = () => {
        this.counter++
      }
    }

    StoreApplication = CounterStore
    StoreSession = CounterStore1
  })

  it('store parameters should just works once', () => {
    @injectedComponent
    class Child extends React.Component {
      @injection(StoreSession, { counter: -1 })
      StoreSession!: CounterStoreType

      @injection(StoreApplication, { counter: -100 })
      StoreApplication!: CounterStoreType

      componentWillUnmount() {
        const { counter } = this.StoreSession || {}
        const { counter: counter1 } = this.StoreApplication || {}
        return counter + counter1
      }

      render() {
        const { counter } = this.StoreSession || {}
        const { counter: counter1 } = this.StoreApplication || {}
        return counter + counter1
      }
    }

    const compRef1 = React.createRef<any>()
    @injectedComponent
    class Comp extends React.Component {
      @injection(StoreSession, { counter: 1 })
      StoreSession!: CounterStoreType

      @injection(StoreApplication, { counter: 100 })
      StoreApplication!: CounterStoreType

      render() {
        const { counter } = this.StoreSession || {}
        const { counter: counter1 } = this.StoreApplication || {}
        return (
          <>
            {counter + counter1} <Child ref={compRef1} />
          </>
        )
      }
    }

    const compRef = React.createRef<any>()
    render(<Comp ref={compRef} />)
    // 父组件实例化后 store常驻
    expect(compRef.current.StoreSession.counter).toBe(1)
    expect(compRef.current.StoreApplication.counter).toBe(100)

    // 子组件实例化后 injection 参数无效
    expect(compRef1.current.StoreSession.counter).toBe(1)
    expect(compRef1.current.StoreApplication.counter).toBe(100)
  })

  it('function store parameters should works', () => {
    @injectedComponent
    class Comp extends React.Component {
      some = -1000

      @injection(StoreSession, (self: any) => {
        return { counter: self.some }
      })
      StoreSession!: CounterStoreType

      @injection(StoreApplication, (self: any) => {
        return { counter: self.some }
      })
      StoreApplication!: CounterStoreType

      render() {
        const { counter } = this.StoreSession || {}
        const { counter: counter1 } = this.StoreApplication || {}
        return <>{counter + counter1}</>
      }
    }

    const compRef = React.createRef<any>()
    render(<Comp ref={compRef} />)

    expect(compRef.current.StoreSession.counter).toBe(-1000)
    expect(compRef.current.StoreApplication.counter).toBe(-1000)
  })

  it('typescript type metadata should works', () => {
    @store('application')
    class CounterStore {
      counter = 0
      increment = () => {
        this.counter++
      }
    }

    @store('session')
    class CounterStore1 {
      counter = 0
      increment = () => {
        this.counter++
      }
    }

    @injectedComponent
    class Comp extends React.Component {
      some = -1000

      @injection()
      StoreSession!: CounterStore1

      @injection()
      StoreApplication!: CounterStore

      render() {
        const { counter } = this.StoreSession || {}
        const { counter: counter1 } = this.StoreApplication || {}
        return <>{counter + counter1}</>
      }
    }

    const compRef = React.createRef<any>()
    render(<Comp ref={compRef} />)

    expect(compRef.current.StoreSession.counter).toBe(0)
    expect(compRef.current.StoreApplication.counter).toBe(0)
  })
})
