<template>
  <q-select
    filled
    v-model="selectedProduct"
    :use-input="!selectedProduct"
    input-debounce="300"
    color="black"
    label="Selecione um produto"
    :options="filteredOptions"
    @filter="filterFn"
    placeholder="Digite o nome ou o código de referencia"
    option-value="id"
    @update:model-value="onProductSelected"
    behavior="menu"
    :hide-dropdown-icon="true"
    :menu="showOptions"
    :display-value="displayValue"
  >
    <template v-slot:prepend>
      <q-icon
        style="font-size: 40px; height: 100%; top: 5px; align-items: end"
        name="search"
      />
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label style="font-size: 15px"
            >{{ scope.opt.nome }} - R$ {{ scope.opt.preco.toFixed(2) }} - Ref:
            {{ scope.opt.referencia }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:append>
      <q-icon
        style="font-size: 35px; top: 10px"
        v-if="selectedProduct !== null"
        class="cursor-pointer"
        name="delete"
        color="negative"
        @click.stop.prevent="selectedProduct = null"
      />
    </template>

    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> Sem resultados </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
defineOptions({
  name: "SelectProduct",
});

const props = defineProps({
  productResetField: {
    type: Boolean,
    default: false,
  },
});

import { ref, computed, watch } from "vue";

const emit = defineEmits(["productSelected", "productValueReset"]);

const produtos = ref([
  { id: 1, nome: "Caneta Esferográfica", preco: 2.5, referencia: "0001" },
  { id: 2, nome: "Caderno Espiral", preco: 15.0, referencia: "0002" },
  { id: 3, nome: "Mochila Escolar", preco: 75.0, referencia: "0003" },
  { id: 4, nome: "Lápis de Cor", preco: 12.0, referencia: "0004" },
  { id: 5, nome: "Apontador de Lápis", preco: 3.0, referencia: "0005" },
  { id: 6, nome: "Borracha Escolar", preco: 1.5, referencia: "0006" },
  { id: 7, nome: "Régua Plástica", preco: 2.0, referencia: "0007" },
  { id: 8, nome: "Marcador de Texto", preco: 5.0, referencia: "0008" },
  { id: 9, nome: "Pasta Plástica", preco: 10.0, referencia: "0009" },
  { id: 10, nome: "Estojo Simples", preco: 20.0, referencia: "0010" },
]);

const selectedProduct = ref(null);
const filterText = ref("");

// Filtro utilizando o nome ou a referencia
const filteredOptions = computed(() => {
  const searchText = filterText.value.toLowerCase();
  return produtos.value
    .filter(
      (produto) =>
        produto.nome.toLowerCase().includes(searchText) ||
        produto.referencia.toLowerCase().includes(searchText)
    )
    .slice(0, 5);
});

// Função para atualizar a lista conforme for filtrando
function filterFn(val, update) {
  filterText.value = val;
  update(() => filteredOptions.value);
}

// Computa se o dropdown deve ser mostrado
const showOptions = computed(() => filterText.value.length > 0);

// Define o texto a ser exibido no campo de entrada do q-select
const displayValue = computed(() => {
  return selectedProduct.value
    ? `${
        selectedProduct.value.nome
      } - Preço: R$${selectedProduct.value.preco.toFixed(2)} - Ref: ${
        selectedProduct.value.referencia
      }`
    : "";
});

// Emitindo o evento quando o produto é selecionado
function onProductSelected(newValue) {
  selectedProduct.value = newValue;
  emit("productSelected", newValue);
}

// Resetar o valor do produto quando não tiver produto selecionado
watch(
  () => selectedProduct.value,
  (newValue) => {
    if (newValue === null) {
      emit("productValueReset", true);
    } else {
      emit("productValueReset", false);
    }
  },
  { immediate: true }
);

// Resetar o campo do product quando um item é adicionado a lista de itens
watch(
  () => props.productResetField,
  (newValue) => {
    if (newValue === true) {
      selectedProduct.value = null;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
:deep(.q-field__control) {
  height: 80px;
  font-size: 16px;
}
:deep(q-item-label) {
  font-size: 30px;
}
</style>
