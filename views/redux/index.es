import { combineReducers } from 'redux'
import { mapValues } from 'lodash'

import { reducer as constReducer } from './const'
import { reducer as info } from './info'
import { reducer as sortie } from './sortie'
import { reducer as timers } from './timers'
import { reducer as config } from './config'
import { reducer as layout } from './layout'
import { reducer as battle } from './battle'
import { reducer as alert } from './alert'
import { reducer as plugins } from './plugins'
import misc from './misc'

// === Utils ===

// === Root reducer ===

function secureExtensionConfig(extensionConfig) {
  return mapValues(extensionConfig, (func, key) => {
    if (func) {
      // Use combineReducers to check sanity of `func`
      const wrappedReducer = combineReducers({_: func})
      return (state={}, action) => {
        try {
          return wrappedReducer(state, action)
        } catch(e) {
          console.error(`Error in extension ${key}`, e.stack)
          return state
        }
      }
    } else {
      return () => ({})
    }
  })
}

export function reducerFactory(extensionConfig) {
  return combineReducers({
    const: constReducer,
    info,
    sortie,
    timers,
    config,
    layout,
    battle,
    alert,
    plugins,
    misc,
    ext: extensionConfig ? combineReducers(secureExtensionConfig(extensionConfig)) : (() => ({})),
  })
}

// === Actions ===

export function onGameResponse({method, path, body, postBody}) {
  return {
    type: `@@Response${path}`,
    method,
    path,
    body,
    postBody,
  }
}

export function onGameRequest({method, path, body}) {
  return {
    type: `@@Request${path}`,
    method,
    path,
    body,
  }
}

export function onConfigChange({path, value}) {
  return {
    type: `@@Config`,
    path,
    value,
  }
}
