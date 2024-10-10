<template>
  <FieldRender :schema="propsSchema" :formData="propsFormData" :formWatch="formWatch" :ruleResult="ruleResult" />
</template>

<script setup lang="ts">
defineOptions({
  name: 'AlloyForm'
})
import { Ref, ref, provide } from 'vue'
import FieldRender from './fieldRender.vue'
import useForm from '../hooks/useForm'
// import '../../style.css'
import { SchemaProps, RuleProps, FormActionProps } from '../@types'

type TProp = {
  formData?: Record<string, any>
  schema: SchemaProps
  components: Record<string, any>
  formWatch?: Record<string, (val: any, key?: string) => any>
}

const props = withDefaults(defineProps<TProp>(), {
  formData: () => ({})
})

const propsSchema = ref<SchemaProps>(props.schema)
const propsFormData: Ref<Record<string, any>> = ref(props.formData)
const formRules = ref<Record<string, RuleProps[]>>({})
const ruleResult = ref<Record<string, any>>({})

const formActions = useForm({ schema: propsSchema, formData: propsFormData, formRules, ruleResult })
provide('formActions', formActions)

defineExpose<FormActionProps>({
  ...formActions
})
</script>
