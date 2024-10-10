import { AlloyForm } from './src/form/index'

declare module 'vue' {
  export interface GlobalComponents {
    AlloyForm: typeof AlloyForm
  }
}
