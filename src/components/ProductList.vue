<template>
  <div class="example-row-variable-width col-12 col-md-6">
    <q-card class="q-px-md q-pb-md">
      <q-table
        :rows="productStore.productList"
        :columns="columns"
        row-key="referencia"
        class="q-mt-md"
        :rows-per-page-options="[5, 10, 20]"
        style="min-height: 400px"
      >
        <template v-slot:no-data>
          <div class="no-data-message">Nenhum item neste pedido!</div>
        </template>

        <template v-slot:body-cell-preco="props">
          <q-td :props="props">{{ formatCurrency(props.row.preco) }}</q-td>
        </template>
        <template v-slot:body-cell-acoes="props">
          <q-td :props="props">
            <q-btn
              icon="delete"
              color="negative"
              @click="removeProduct(props.row)"
              flat
              dense
            />
          </q-td>
        </template>
      </q-table>

      <div class="row q-col-gutter-md">
        <div class="col-12">
          <DiscountAndIncrease
            :initialPrice="totalPrice"
            @finalPriceUpdated="handleFinalPriceUpdate"
          />
        </div>

        <div class="col-12 col-md-6">
          <FormatProductValue descricao="Valor Total" :preco="totalPrice" />
        </div>
        <div class="col-12 col-md-6">
          <FormatProductValue
            descricao="Valor Total com desconto"
            :preco="displayedFinalPrice"
          />
        </div>
        <div class="justify-center col-12">
          <q-btn
            style="width: 100%; font-size: 15px; margin: 0"
            @click="clearProductList"
            label="Limpar Lista"
            color="negative"
            class="q-mt-md"
          />
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { formatCurrency } from "../utils/currencyFormatter.js";
import { useProductStore } from "../store/useProductStore.js";
import DiscountAndIncrease from "../components/DiscountAndIncrease.vue";
import FormatProductValue from "../components/FormatProductValue.vue";

const productStore = useProductStore(); // Usando o Pinia store

// Definir o ref para armazenar o valor do preço final atualizado
const updateFinalPrice = ref(0);

// Função para remover produto da lista
const removeProduct = (product) => {
  const index = productStore.productList.indexOf(product);
  if (index > -1) {
    productStore.removeProducts(index);
  }
};

// Função para limpar a lista de produtos
const clearProductList = () => {
  productStore.clearProductList();
};

// Computed para calcular o total dos preços
const totalPrice = computed(() => {
  return productStore.productList.reduce((total, product) => {
    const preco = isNaN(product.preco) ? 0 : parseFloat(product.preco);
    return total + preco;
  }, 0);
});

// Computed para mostrar o valor correto baseado na modificação
const displayedFinalPrice = computed(() => {
  return updateFinalPrice.value > 0 ? updateFinalPrice.value : totalPrice.value;
});

// Função chamada quando o componente DiscountAndIncrease emite um novo valor final
const handleFinalPriceUpdate = (newValue) => {
  updateFinalPrice.value = newValue;
};

// Colunas para o q-table
const columns = [
  {
    name: "nome",
    required: true,
    label: "Nome",
    align: "left",
    field: "nome",
    sortable: true,
  },
  {
    name: "referencia",
    required: true,
    label: "Referência",
    align: "left",
    field: "referencia",
    sortable: true,
  },
  {
    name: "preco",
    required: true,
    label: "Preço",
    align: "left",
    field: "preco",
    sortable: true,
  },
  { name: "acoes", label: "Ações", align: "left" },
];
</script>

<style scoped>
.no-data-message {
  position: absolute;
  font-size: 20px;
  top: 60px;
  left: 10px;
}
</style>
