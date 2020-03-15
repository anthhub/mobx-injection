# mobx-injection

mobx-injection 是一个专门用来管理和组织 mobx stroe 的工具库; 旨在更简单,更有效的使用 store. mobx-injection 使用类似于 Spring DI System 的方式, 把 store class 直接注入到使用者(react 组件)中, 使用者不必自己管理自己所需要依赖 store 的依赖, 在组件使用的时候, DI 容器可以直接创建好依赖 store 的实例提供给组件使用. 这样一来, 开发人员可以更加专注于业务的开发, mobx 多 store 的方式管理和组织起来空前简单. 现在为止, 理念和用法和 Spring 差不多. 但是由于前段实际开发和后端还是有很大的区别, 所以在使用和介绍上会更复杂一些.

# Installation

```
yarn add mobx-injection
```

> mobx-injection 仅支持 es6 及以上

# Core concepts

mobx-injection 和 mobx 一样旨在以尽可能少的 api 完成必要功能. 这里需要知道, mobx-injection 要解决的痛点: 在前端开发中, store 的作用道理是什么? 我认为可以分为两个作用:

- 在整个 Frontend App 运行过程中, 需要记录全局的全局信息, 比如用户信息, 字段字典等, 使得整个应用的各个组件, 甚至于请求参数中都可以方便的获取; 这个的 store 便可设为全局 store; 我们把这样的 store scope 设置为 application
- 在对于某个页面来说, 如果业务特别复杂, 父子组件嵌套特别多, 那么组件间交互将会变得特别痛苦!!! 这个时候也需要把一些数据和方法放在组件, 无论组件嵌套多深, 都可以直接拿到! (没错, 这就是 store 前端历史上为什么会出现 store 的). 这样的情况下, 这个 store 是于业务相关的, 其他业务不需要知道, 为了减轻心智负担, 那么它不应该暴露在全局, 只能在局部使用; 并且当页面销毁的时候, 它也必须销毁: 减少内存占用; 避免数据污染. 这样的 store scope 设为 session.

# Requirements

- "reflect-metadata": "^0.1.12"
- "react": "^16.8.0 || 16.9.0-alpha.0",
- "react-router-dom": "^5.1.2"

> - 值得注意的是, api 分别实现了 hooks 版本和 class 版本, 如果想在 hooks 中使用, 请升级 react
> - 为了能正常使用 typescript 反射, 请在 tsconfig 中设置`"emitDecoratorMetadata": true`

# Boilerplates

- https://github.com/anthhub/mobx-injection-example

# Features

- store

> 用于 store 标志 scope; 默认为 application

```typescript
@store('application')
export class GlobalStore {}

@store('session')
export class LocalStore {}
```

- InjectedRouter

> 由于实现依赖了 react-router-dom, 需要在路由中加入此路由组件

```javascript react
function App() {
  return (
    <BrowserRouter>
      <InjectedRouter>
        <Switch>
          <Route path="/class/:id" component={() => <Klass />} />
          <Route exact path="/hooks" component={() => <Hooks />} />
          <Route exact path="/class" component={() => <Klass />} />
        </Switch>
      </InjectedRouter>
    </BrowserRouter>
  )
}
```

- useInjection / injection

  > 在组件中直接引用 store, 传入 class 和初始化参数, 初始化参数支持对象和函数

  - hooks 中使用 useInjection

  ```javascript react
  function Hooks() {
    const { username, operateCounter } = useInjection(GlobalStore, { name: 'Hooks' })
    const { counter } = useInjection(LocalStore, { name: 'Hooks' })
    return (
      <div className="App">
        Hooks
        <header className="App-header">计数: {counter}</header>
        <header className="App-header">
          {username}总共操作了{operateCounter}次{' '}
        </header>
        <Child />
      </div>
    )
  }
  ```

  - class 中使用 injection

  ```javascript react
  @withRouter
  @observer
  class Klass extends React.Component<IP> {
  @injection(GlobalStore, { name: 'Klass' })
  globalStore!: GlobalStore

  @injection(LocalStore, { name: 'Klass' })
  localStore!: LocalStore

  render() {
    const { username, operateCounter } = this.globalStore
    const {
      localStore: { counter },
    } = this
    return (
      <div className="App">
        Klass
        <header className="App-header">计数: {counter}</header>
        <header className="App-header">
          {username}总共操作了{operateCounter}次
        </header>
        <Child />
      </div>
    )
  }
  }
  ```

   > 其他情况下(请求参数) 中使用 getInjection
