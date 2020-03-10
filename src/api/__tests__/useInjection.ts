import useInjection from '../useInjection'
import store from '../store'
import { renderHook, act } from '@testing-library/react-hooks'

class CounterStoreType {
  counter = 0
  increment = () => {
    this.counter++
  }
}

describe('useInjection', () => {
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

  it('should be defined', () => {
    expect(useInjection).toBeDefined()
  })

  it('store parameters should just works once', () => {
    ;[StoreApplication, StoreSession].forEach(store => {
      const hook = renderHook<unknown, CounterStoreType>(() =>
        useInjection(store, { counter: 100 })
      )
      expect(hook.result.current.counter).toBe(100)

      const hook1 = renderHook<unknown, CounterStoreType>(() =>
        useInjection(store, { counter: 9999 })
      )
      expect(hook1.result.current.counter).toBe(100)
    })
  })

  it('function store parameters should works', () => {
    ;[StoreApplication, StoreSession].forEach(store => {
      const hook2 = renderHook<unknown, CounterStoreType>(() =>
        useInjection(store, () => ({ counter: -1000 }))
      )
      expect(hook2.result.current.counter).toBe(-1000)
    })
  })

  it('application store should always live form creation to frontend app destroy', async () => {
    // 创建者 以后所有的store的共享了

    const store = StoreApplication
    const hook = renderHook<unknown, CounterStoreType>(() => useInjection(store))
    expect(hook.result.current.counter).toBe(0)
    act(() => {
      hook.result.current.increment()
    })
    expect(hook.result.current.counter).toBe(1)

    hook.rerender()
    expect(hook.result.current.counter).toBe(1)

    // 第二个
    const hook1 = renderHook<unknown, CounterStoreType>(() => useInjection(store))
    expect(hook1.result.current.counter).toBe(1)

    hook.unmount()

    act(() => {
      hook1.result.current.increment()
    })
    expect(hook1.result.current.counter).toBe(2)

    // 第三个
    const hook2 = renderHook<unknown, CounterStoreType>(() => useInjection(store))
    expect(hook2.result.current.counter).toBe(2)
    hook2.unmount()
  })

  it("session store should just live form creation to destroy of it's creater component", async () => {
    const store = StoreSession
    // 创建者 以后的store存活时间取决于创建者存活时间
    const hook = renderHook<unknown, CounterStoreType>(() => useInjection(store))
    expect(hook.result.current.counter).toBe(0)
    act(() => {
      hook.result.current.increment()
    })
    expect(hook.result.current.counter).toBe(1)

    hook.rerender()
    expect(hook.result.current.counter).toBe(1)

    // 第二个
    const hook1 = renderHook<unknown, CounterStoreType>(() => useInjection(store))
    expect(hook1.result.current.counter).toBe(1)

    // 子组件销毁后不影响store
    hook1.unmount()
    expect(hook1.result.current.counter).toBe(1)

    // 父组件销毁后于子组件销毁
    hook.unmount()

    // 第三个 之前的创建者销毁后, 新的store从头开始
    const hook2 = renderHook<unknown, CounterStoreType>(() => useInjection(store))
    expect(hook2.result.current.counter).toBe(0)
    hook2.unmount()
  })
})
