<template>
  <q-input filled v-model.number="quantity" outlined dense min="0">
    <template v-slot:prepend>
      <q-btn
        icon="remove"
        flat
        round
        color="red"
        dense
        @click="decrement"
        size="md"
        style="border-radius: 50%; border: solid 1px"
      />
    </template>
    <template v-slot:append>
      <q-btn
        icon="add"
        flat
        round
        color="green"
        dense
        @click="increment"
        size="md"
        style="border-radius: 50%; border: solid 1px; margin-right: 8px"
      />
    </template>
    <span class="unSymbol">UN</span>
  </q-input>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  initialQuantity: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:quantity"]);

const quantity = ref(1); // Começa com 1 quando há um item selecionado

function increment() {
  if (props.initialQuantity) {
    quantity.value++;
    emit("update:quantity", quantity.value);
  }
}

function decrement() {
  if (props.initialQuantity && quantity.value > 1) {
    quantity.value--;
    emit("update:quantity", quantity.value);
  }
}

// Função para monitorar mudanças no campo de entrada
watch(quantity, (newValue) => {
  // Se o campo for apagado, redefinir para 1 se initialQuantity for true
  if (newValue === null || newValue === "" || newValue < 1) {
    if (props.initialQuantity) {
      quantity.value = 1;
    } else {
      quantity.value = 0;
    }
  }
  emit("update:quantity", quantity.value);
});

watch(
  () => props.initialQuantity,
  (newInitialQuantity) => {
    quantity.value = newInitialQuantity ? 1 : 0;
    emit("update:quantity", quantity.value);
  },
  { immediate: true }
);
</script>

<style scoped>
:deep(.unSymbol) {
  position: absolute;
  font-size: 20px;
  color: #837c7c52;
  right: 15px;
  top: 18px;
  z-index: -999;
}

:deep(.q-field__native) {
  font-size: 25px;
  text-align: center;
}

:deep(.q-field__control) {
  height: 65px;
  align-items: center;
}
</style>
