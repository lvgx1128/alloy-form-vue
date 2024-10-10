import type { FormActionProps, RuleProps, SchemaProps, UpdateSchemaBaseProps } from '../@types'
import { get, set, unset } from 'lodash-es'
import { schemaFormat, validateRule } from '../utils/index'
import { Ref } from 'vue'

interface IProps {
  schema: Ref<SchemaProps>
  ruleResult: Ref<Record<string, any>>
  formData: Ref<Record<string, any>>
  formRules: Ref<Record<string, RuleProps[]>>
}

export default function useForm({ schema, formData, formRules, ruleResult }: IProps): FormActionProps {
  // schema 数据处理
  // 更新schema数据
  const setSchema = (newSchema: SchemaProps | Record<string, UpdateSchemaBaseProps>) => {
    const schemaRef = JSON.parse(JSON.stringify(schema.value))
    const formatSchema = schemaFormat(schemaRef, newSchema)
    console.log('🚀 ~ setSchema ~ formatSchema:', formatSchema)
    schema.value = formatSchema
  }
  // 移除schema 中的某个字段
  const removeSchemaByKey = (key: string) => {
    const properties = schema.value?.properties ?? {}
    unset(properties, key)
    schema.value = schemaFormat(schema.value, properties)
  }
  // form表单数据处理
  // 设置表单数据
  const setData = (param: Record<string, any>) => {
    formData.value = {
      ...formData.value,
      ...param
    }
    validateFields()
  }
  const setDataByKey = (key: string, value: any) => {
    formData.value = {
      ...formData.value,
      [key]: value
    }
    validateFields()
  }
  const clearData = () => {
    formData.value = {}
    validateFields()
  }
  // 获取表单数据
  const getData = () => {
    const currentData = JSON.parse(JSON.stringify(formData.value))
    return currentData
  }
  // 根据key获取表单中的数据
  const getDataByKey = (key: string) => {
    return get(formData.value, key)
  }

  // form表单校验规则
  // 更新schema数据
  const setRules = (rules: Record<string, RuleProps[]>) => {
    formRules.value = rules
  }

  const getFieldRules = (key: string): RuleProps[] => {
    return (formRules.value && formRules.value[key]) || []
  }

  // 校验表单数据
  const validateFields = (keys?: string[]): Promise<{ validate: boolean; data: Record<string, any> }> => {
    const ruleResultCopy = JSON.parse(JSON.stringify(ruleResult.value))
    let isError = false
    const validateKeys: string[] = keys || Object.keys(formRules.value ?? {})
    const flatten = schema.value?.properties ?? {}
    validateKeys.forEach(async (key: string) => {
      const fieldRules = get(formRules.value, key) || []
      const flattenItem = flatten[key]
      const bind = flattenItem?.bind
      const fieldData = get(formData.value, bind?.[0] || key)
      const result = validateRule(fieldRules, fieldData)
      set(ruleResultCopy, key, result)
      if (result.isError) {
        isError = true
      }
    })
    ruleResult.value = { ...ruleResultCopy }
    return new Promise((resolve, reject) => {
      if (isError) {
        const rej = { validate: false, data: getData() }
        reject(rej)
      } else {
        resolve({ validate: !isError, data: getData() })
      }
    })
  }

  return {
    setSchema,
    removeSchemaByKey,
    setData,
    setDataByKey,
    getData,
    getDataByKey,
    setRules,
    getFieldRules,
    validateFields,
    clearData
  }
}
