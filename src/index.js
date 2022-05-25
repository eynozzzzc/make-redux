function renderApp(newAppState, oldAppState = {}) {
  if (newAppState === oldAppState) return
  console.log('render app...')
  renderTitle(newAppState.title, oldAppState.title)
  renderContent(newAppState.content, oldAppState.content)
}

function renderTitle(newTitle, oldTitle = {}) {
  if (newTitle === oldTitle) return
  console.log('render title...')
  const titleDOM = document.getElementById('title')
  titleDOM.innerHTML = newTitle.text
  titleDOM.style.color = newTitle.color
}

function renderContent(newContent, oldContent = {}) {
  if (newContent === oldContent) return // 数据没有变化就不渲染了
  console.log('render content...')
  const contentDOM = document.getElementById('content')
  contentDOM.innerHTML = newContent.text
  contentDOM.style.color = newContent.color
}


// reducer
function stateChanger(state, action) {
  if (!state) {
    return {
      title: {
        text: 'React.js 小书',
        color: 'red',
      },
      content: {
        text: 'React.js 小书内容',
        color: 'blue'
      }
    }
  }
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT':
      return {
        ...state,
        title: {
          ...state.title,
          text: action.text
        }
      }
    case 'UPDATE_TITLE_COLOR':
      return { // 构建新的对象并且返回
        ...state,
        title: {
          ...state.title,
          color: action.color
        }
      }
    default:
      return state
  }
}

// 可以定义各种不同的reducer
// function themeReducer(state, action) {
//   if (!state) return {
//     themeName: 'Red Theme',
//     themeColor: 'red'
//   }
//   switch (action.type) {
//     case 'UPATE_THEME_NAME':
//       return { ...state, themeName: action.themeName }
//     case 'UPATE_THEME_COLOR':
//       return { ...state, themeColor: action.themeColor }
//     default:
//       return state
//   }
// }

// 用来专门生产这种 state和dispatch 的集合，这样别的 App 也可以用这种模式
// state表示应用程序状态
// stateChanger 描述应用程序状态会根据 action 发生什么变化，相当于dispatch
function createStore(reducer) {
  let state = null
  // listener是一个函数数组
  const listeners = []
  // 通过 subscribe 传入数据变化的监听函数listener
  const subscribe = (listener) => listeners.push(listener)
  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action)
    // 每当 dispatch 的时候,监听函数才会被调用
    listeners.forEach((listener) => listener())
  }
  dispatch({})  //初始化state
  return { getState, dispatch, subscribe }
}


const store = createStore(stateChanger)
let oldState = store.getState()

store.subscribe(() => {
  const newState = store.getState()
  renderApp(newState, oldState)
  oldState = newState
})

renderApp(store.getState())
store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }) // 修改标题文本
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色