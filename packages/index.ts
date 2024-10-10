export * from './src/form'

import AlloyForm from './src/form'

import './style.css'

const components = [AlloyForm]

export function install(app: any) {
  components.forEach(function (component: { install: (arg0: any) => any }) {
    return component.install(app)
  })
}

export type { FormActionProps } from './src/@types'
