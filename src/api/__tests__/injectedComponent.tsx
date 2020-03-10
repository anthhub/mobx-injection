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

  it(`application store should always live form creation to frontend app destroy; session store should just live form creation to destroy of it's creater component`, () => {
    @injectedComponent
    class Comp extends React.Component {
      @injection(StoreSession, { counter: 1 })
      StoreSession!: CounterStoreType

      @injection(StoreApplication, { counter: 100 })
      StoreApplication!: CounterStoreType

      render() {
        const { counter } = this.StoreSession || {}
        const { counter: counter1 } = this.StoreApplication || {}
        return <>{counter + counter1}/></>
      }
    }

    @injectedComponent
    class Child extends React.Component {
      @injection(StoreSession, { counter: -1 })
      StoreSession!: CounterStoreType

      @injection(StoreApplication, { counter: -100 })
      StoreApplication!: CounterStoreType

      render() {
        const { counter } = this.StoreSession || {}
        const { counter: counter1 } = this.StoreApplication || {}
        return counter + counter1
      }
    }

    const compRef = React.createRef<any>()
    const comp = render(<Comp ref={compRef} />)
    // 父组件实例化后 store常驻
    expect(compRef.current.StoreSession.counter).toBe(1)
    expect(compRef.current.StoreApplication.counter).toBe(100)

    comp.rerender(<Comp ref={compRef} />)

    expect(compRef.current.StoreSession.counter).toBe(1)
    expect(compRef.current.StoreApplication.counter).toBe(100)

    act(() => {
      compRef.current.StoreSession.increment()
      compRef.current.StoreApplication.increment()
    })

    expect(compRef.current.StoreSession.counter).toBe(2)
    expect(compRef.current.StoreApplication.counter).toBe(101)

    // 第二次引用的子组件
    const compRef1 = React.createRef<any>()
    const comp1 = render(<Child ref={compRef1} />)
    expect(compRef.current.StoreSession.counter).toBe(2)
    expect(compRef.current.StoreApplication.counter).toBe(101)
    expect(compRef1.current.StoreSession.counter).toBe(2)
    expect(compRef1.current.StoreApplication.counter).toBe(101)

    act(() => {
      compRef1.current.StoreSession.increment()
      compRef1.current.StoreApplication.increment()
    })
    expect(compRef.current.StoreSession.counter).toBe(3)
    expect(compRef.current.StoreApplication.counter).toBe(102)
    expect(compRef1.current.StoreSession.counter).toBe(3)
    expect(compRef1.current.StoreApplication.counter).toBe(102)

    // 子组件销毁后不影响store
    comp1.unmount()
    expect(compRef.current.StoreSession.counter).toBe(3)
    expect(compRef.current.StoreApplication.counter).toBe(102)

    // 父组件销毁后 session store 跟着销毁
    comp.unmount()

    // 第三个 之前的创建者销毁后, session store从头开始 application store保持
    const compRef2 = React.createRef<any>()
    const comp2 = render(<Comp ref={compRef2} />)
    expect(compRef2.current.StoreSession.counter).toBe(1)
    expect(compRef2.current.StoreApplication.counter).toBe(102)
    comp2.unmount()
  })
})
