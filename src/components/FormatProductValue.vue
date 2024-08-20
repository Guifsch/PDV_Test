<template>
  <q-input
    outlined
    filled
    v-model="displayedValue"
    :label="descricao"
    @input="updateValue"
    readonly
  />
</template>

<script setup>
import { formatCurrency } from "../utils/currencyFormatter.js";
import { ref, watch } from "vue";

defineOptions({
  name: "FormatSelectProducts",
});

const props = defineProps({
  preco: {
    type: Number,
    required: true,
    default: 0,
  },
  descricao: {
    type: String,
    required: true,
    default: "",
  },
});

const selectedProductValue = ref(props.preco);
const displayedValue = ref(formatCurrency(props.preco));

// Função chamada ao atualizar o valor do input
function updateValue(value) {
  let numberValue =
    parseFloat(value.replace(/[^0-9,]/g, "").replace(",", ".")) || 0;

  // Impede o valor de ser negativo
  numberValue = numberValue < 0 ? 0 : numberValue;

  selectedProductValue.value = numberValue;
  displayedValue.value = formatCurrency(numberValue);
}

// Observa mudanças na prop 'preco' e formata o valor
watch(
  () => props.preco,
  (newPreco) => {
    console.log(newPreco, "AAA");
    const validPreco = newPreco < 0 ? 0 : newPreco; // Verifica se o preco é negativo
    selectedProductValue.value = validPreco;
    displayedValue.value = formatCurrency(validPreco);
  },
  { immediate: true }
);
</script>

<style scoped>
:deep(.q-field__native) {
  text-align: right;
  font-size: 25px;
}
:deep(.q-field__control) {
  height: 65px;
}
:deep(.q-field__control:before) {
  opacity: 0 !important;
}
</style>
