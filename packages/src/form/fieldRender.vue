<template>
  <div class="alloy-form-container">
    <div
      v-for="item in fieldList"
      :key="item.fieldKey"
      class="alloy-form-item-box"
      :class="`alloy-form-${item?.display || display} ${item.className || ''} ${
        item.format === 'textarea' ? 'alloy-form-item-textarea' : ''
      }`"
    >
      <FieldItem
        v-if="item"
        v-bind="$attrs"
        :formWatch="formWatch"
        :ruleResult="ruleResult"
        :fieldItem="item"
        :formData="formData"
        :key="item.fieldKey"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SchemaProps, FormInstanceProps, RuleProps, FieldItemProps } from '../@types'
import { ref, inject, watch } from 'vue'
import { set } from 'lodash-es'
import FieldItem from './fieldItem.vue'

type TProps = {
  schema: SchemaProps
  formData?: Record<string, any>
  ruleResult?: Record<string, any>
  formWatch?: Record<string, (val: any, key?: string) => void>
}
const formActions = inject<FormInstanceProps>('formActions')
interface IFieldItemProps extends FieldItemProps {
  isRequired?: boolean
}

const props = withDefaults(defineProps<TProps>(), {
  formData: () => ({})
})

const { setRules } = formActions || {}

const fieldList = ref<IFieldItemProps[]>([])
const display = ref('')

watch(
  () => props.schema,
  val => {
    const flatten = val?.properties ?? {}
    // 解析schema
    const formRules: Record<string, RuleProps[]> = {}
    // 表单item上绑定的属性
    const itemProps = val?.itemProps ?? {}
    display.value = itemProps?.display || 'block'
    fieldList.value = Object.keys(flatten).reduce((prev: IFieldItemProps[], item: string) => {
      const baseProps = itemProps?.props || {}
      const fieldItem: IFieldItemProps = {
        ...itemProps,
        ...flatten[item],
        fieldKey: item
      }
      if (fieldItem?.props) {
        fieldItem.props = { ...fieldItem?.props, ...baseProps }
      }
      const { rules = [] } = fieldItem
      if (fieldItem?.isRequired) {
        rules.push({ required: true, message: fieldItem?.label + '必填' })
      }
      if (rules?.length > 0) set(formRules, fieldItem.fieldKey, rules)
      const index: number = rules?.findIndex((rule: RuleProps) => rule?.required) ?? -1
      fieldItem.isRequired = index > -1
      if (!fieldItem.hide) prev.push(fieldItem)
      return prev
    }, [])
    setRules?.(formRules)
  },
  { deep: true, immediate: true }
)
</script>
