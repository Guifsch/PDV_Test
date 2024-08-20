<template>
  <q-page class="home row justify-center">
    <div class="q-pa-md example-row-variable-width col-12 col-lg-6">
      <div class="row justify-center">
        <div class="col-12 q-mb-md">
          <SelectProduct
            @productSelected="handleProductSelected"
            @productValueReset="productValueReset"
            :productResetField="productResetField"
          />
        </div>
      </div>

      <div class="row q-mb-md q-col-gutter-md">
        <div class="col-12 col-md-6">
          <FormatProductValue
            descricao="Valor Unitário"
            :preco="finaProductUnitValue"
          />
        </div>
        <div class="col-12 col-md-6">
          <FormatProductValue
            descricao="Valor Total do item"
            :preco="finalProductValue"
          />
        </div>
      </div>

      <div class="col-12 q-mb-md">
        <DiscountAndIncrease
          :resetFields="productResetField"
          :initialPrice="selectedProductUnitValue"
          @finalPriceUpdated="updateFinalPrice"
          @unitPriceUpdated="unitPriceUpdated"
          :currentQuantityRef="currentQuantity"
        />
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <IncrementDecrementButton
            @update:quantity="handleQuantityUpdate"
            :initialQuantity="initialQuantity"
          />
        </div>

        <div class="row col-12 col-md-6">
          <q-btn
            style="width: 100%; font-size: 15px"
            @click="addProductsToList"
            label="Adicionar Produtos"
            color="positive"
          />
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-6">
      <ProductList />
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import SelectProduct from "../components/SelectProduct.vue";
import FormatProductValue from "../components/FormatProductValue.vue";
import IncrementDecrementButton from "../components/IncrementDecrementButton.vue";
import DiscountAndIncrease from "../components/DiscountAndIncrease.vue";
import ProductList from "../components/ProductList.vue";
import { useProductStore } from "../store/useProductStore.js";

const productStore = useProductStore(); // Usando o Pinia store
const productResetField = ref(false);
const selectedProduct = ref(null);
const initialQuantity = ref(false);
const currentQuantity = ref(0);
const selectedProductUnitValue = ref(0);
const finalProductValue = ref(0);
const productList = ref([]);
const finaProductUnitValue = ref(0);

// Função para resetar todos os campos
function resetFields() {
  selectedProduct.value = null;
  selectedProductUnitValue.value = 0;
  finalProductValue.value = 0;
  finaProductUnitValue.value = 0;
}

// Função para lidar com o reset dos campos
function productValueReset(product) {
  if (product === true) {
    resetFields();
  }
}

// Função para adicionar itens no store
function addProductsToList() {
  productStore.addProducts(productList.value);
  productList.value = [];
  productResetField.value = true;
  resetFields();
}

// Função para lidar com a quantidade atualizada emitida pelo IncrementDecrementButton
function handleQuantityUpdate(newQuantity) {
  currentQuantity.value = newQuantity;
  updateProductList();
}

// Função para lidar com a seleção do produto no componente filho
function handleProductSelected(product) {
  productList.value = [];
  productResetField.value = false;
  selectedProduct.value = product;
  selectedProductUnitValue.value = parseFloat(product.preco);

  // Adicionar produto no array quando selecionado pela primeira vez
  updateProductList();
}

// Função para lidar com o valor final atualizado
function updateFinalPrice(newValue) {
  finalProductValue.value = newValue;
}

// Função para lidar com o valor final unitário atualizado
function unitPriceUpdated(newValue) {
  finaProductUnitValue.value = newValue;

  // Atualizar o preço dos produtos no array quando o valor unitário final mudar
  updateProductPrices(newValue);
}

// Função para atualizar o productList com base no currentQuantity
function updateProductList() {
  if (!selectedProduct.value) return; // Verificar se selectedProduct não é null

  // Verificar se o preço foi modificado
  const unitPrice =
    finaProductUnitValue.value || selectedProductUnitValue.value;

  // Limpar o array productList para o produto selecionado
  productList.value = productList.value.filter(
    (item) => item.id !== selectedProduct.value.id
  );

  // Adicionar o produto repetido no array conforme o currentQuantity
  for (let i = 0; i < currentQuantity.value; i++) {
    productList.value.push({ ...selectedProduct.value, preco: unitPrice });
  }
}

// Função para atualizar o preço de cada item no productList quando finaProductUnitValue mudar
function updateProductPrices(newPrice) {
  if (!selectedProduct.value) return; // Verificar se selectedProduct não é null

  productList.value.forEach((item) => {
    if (item.id === selectedProduct.value.id) {
      item.preco = newPrice;
    }
  });
}

// Observa mudanças no produto selecionado e ajusta a quantidade inicial
watch(
  selectedProductUnitValue,
  (newValue) => {
    initialQuantity.value = newValue > 0;
  },
  { immediate: true }
);

// Observa mudanças no valor unitário final do produto e atualiza os preços no array
watch(
  finaProductUnitValue,
  (newValue) => {
    updateProductPrices(newValue);
  },
  { immediate: true }
);

// Função para acionar o clique no botão quando "Enter" é pressionado
function handleEnterKeyPress(event) {
  if (event.key === "Enter") {
    addProductsToList();
  }
}

// Adiciona o listener ao montar o componente
onMounted(() => {
  window.addEventListener("keydown", handleEnterKeyPress);
});

// Remove o listener ao desmontar o componente
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleEnterKeyPress);
});
</script>

<style lang="sass" scoped>
.home
  width: 100%
  max-width: 1440px
</style>
