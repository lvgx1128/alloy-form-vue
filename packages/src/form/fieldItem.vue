<template>
  <div
    :class="{
      'alloy-form-item-small': fieldItem.props?.size === 'small',
      'alloy-form-item-border': fieldItem.bordered,
      'alloy-form-item-disabled': componentProps?.disabled,
      'alloy-form-item-error-border': validateResult?.isError && fieldItem.bordered
    }"
    class="alloy-form-item"
  >
    <div class="label-title" :class="{ required: fieldItem.isRequired }" :style="{ width: fieldItem.labelWidth }">
      <span>{{ fieldItem.label }}</span>
    </div>
    <div className="error-message" v-if="validateResult?.isError && fieldItem.bordered">
      {{ validateResult?.message }}
    </div>
    <div class="flex-full" :class="{ 'alloy-form-item-error': validateResult?.isError && !fieldItem.bordered }">
      <div v-if="validateResult?.isError && !fieldItem.bordered" className="error-message">
        {{ validateResult?.message }}
      </div>
      <component
        :is="fieldItem.format"
        class="w-full"
        v-bind="componentProps"
        v-model:value="fieldData"
        @change="changeHandle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { set, isArray } from 'lodash-es'
import { inject, ref, computed, watch } from 'vue'
import { FieldItemProps, FormInstanceProps } from '../@types'
import { getValuesByEvt, isHasInputTarget } from '../utils'
type TProps = {
  fieldItem: FieldItemProps
  formData?: Record<string, any>
  ruleResult?: Record<string, any>
  formWatch?: Record<string, (val: any, key?: string) => void>
}
const props = withDefaults(defineProps<TProps>(), {
  formData: () => ({})
})

const fieldItem = computed(() => props.fieldItem)
const componentProps = ref(props.fieldItem?.props || {})
if (fieldItem.value.bordered) {
  componentProps.value.variant = 'borderless'
}
if (fieldItem.value.options) {
  componentProps.value.options = fieldItem.value.options
}
const formActions = inject<FormInstanceProps>('formActions')
const { setData, validateFields } = formActions || {}

const fieldData = computed(() => props.formData[fieldItem.value.fieldKey])
// useForm中 formData 中field数据
const fieldValue = ref(props.formData.value?.[fieldItem.value.fieldKey])
const validateResult = ref(props.ruleResult?.[fieldItem.value.fieldKey])
watch(
  () => props.ruleResult,
  val => {
    validateResult.value = val?.[fieldItem.value.fieldKey]
  },
  { deep: true }
)
// change事件
function changeHandle(...args: any[]) {
  const currInputEvtIsSelf = (args: any[]) =>
    isHasInputTarget(args[0]) && 'currentTarget' in args[0] ? args[0]?.target === args[0]?.currentTarget : true
  const getValues = (args: any[]) => {
    if (args[0]?.target) {
      if (!isHasInputTarget(args[0])) return args
    }
    return getValuesByEvt(args)
  }
  if (!currInputEvtIsSelf(args)) return
  const values = getValues(args)
  const value = values[0]
  fieldValue.value = value
  const data: Record<string, any> = isArray(fieldItem.value.bind)
    ? value.reduce((prev: Record<string, any>, item: any, index: number) => {
        const key = fieldItem.value.bind?.[index]
        if (key) set(prev, key, item)
        return prev
      }, {})
    : { [fieldItem.value.fieldKey]: value }

  setData?.(data)
  props.formData[fieldItem.value.fieldKey] = value
  if (props.formWatch && props.formWatch[fieldItem.value.fieldKey]) props.formWatch[fieldItem.value.fieldKey](value)
  if (props.formWatch && props.formWatch['#']) props.formWatch['#'](value, fieldItem.value.fieldKey)
  // 在form表单中失去change触发 表单校验
  validateFields?.([fieldItem.value.fieldKey])
}
</script>
