import _AlloyForm from './index.vue'

export const AlloyForm = Object.assign(_AlloyForm, {
  install(app: { component: (arg0: any, arg1: any) => void }) {
    app.component(_AlloyForm?.name || '', _AlloyForm)
  }
})

export default AlloyForm
