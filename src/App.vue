<script setup lang="ts">
import { ref } from 'vue'
import { AlloyForm } from 'alloy-form'
import type { FormActionProps } from 'alloy-form'
import { Input, Select } from 'ant-design-vue'
const schema = {
  type: 'object',
  title: '输入框的联动',
  description: '输入框的联动',
  itemProps: {
    display: 'inline' as 'inline'
  },
  properties: {
    orderNo: {
      label: '单号',
      format: 'a-input',
      props: {
        placeholder: '请输入订单编号',
        type: 'string'
      }
    },
    name: {
      label: '名称',
      format: 'a-input',
      props: {
        placeholder: '请输入名称',
        type: 'string'
      }
    },
    company: {
      label: '公司',
      format: 'a-input',
      props: {
        placeholder: '请输入公司',
        type: 'string'
      }
    },
    company1: {
      label: '公司',
      format: 'a-select',
      isRequired: true,
      options: [
        { label: '下拉框1', value: 1 },
        { label: '下拉框2', value: 2 },
        { label: '下拉框3', value: 3 },
        { label: '下拉框4', value: 4 }
      ],
      props: {
        placeholder: '请输入公司',
        type: 'string',
        allowClear: true
      }
    }
  }
}
const formData = ref({
  company1: 1,
  name: '1'
})
const alloyFormRef = ref<FormActionProps>()
function getData() {
  console.log(alloyFormRef.value?.getData())
}
function clearData() {
  alloyFormRef.value?.clearData()
}
function validateFields() {
  alloyFormRef.value
    ?.validateFields()
    .then((res: any) => console.log(res))
    .catch((err: any) => console.log(err))
}
function setData() {
  alloyFormRef.value?.setData({ company1: 2 })
}
function setSchema() {
  alloyFormRef.value?.setSchema({
    company1: {
      label: '公司111',
      format: 'a-select',
      isRequired: true,
      options: [
        { label: '下拉框1', value: 1 },
        { label: '下拉框2', value: 2 },
        { label: '下拉框3', value: 3 },
        { label: '下拉框4', value: 4 }
      ],
      props: {
        placeholder: '请输入公司',
        type: 'string',
        allowClear: true
      }
    }
  })
}
</script>

<template>
  <div>
    <button @click="clearData">clearData</button>
    <button @click="getData">getData</button>
    <button @click="validateFields">validateFields</button>
    <button @click="setData">setData</button>
    <button @click="setSchema">setSchema</button>
  </div>
  <div style="width: 600px">
    <AlloyForm :schema="schema" :formData="formData" :components="{ Input, Select }" ref="alloyFormRef" />
  </div>
</template>

<style>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
