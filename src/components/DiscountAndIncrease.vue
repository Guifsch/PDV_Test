<template>
  <div class="row q-col-gutter-md">
    <!-- Inputs para desconto -->
    <div class="row justify-center col-12 col-md-6">
      <q-input
        class="col-7 discount"
        filled
        type="number"
        color="black"
        label="Desconto Unitário"
        min="0"
        v-model="localDiscountValue"
      >
        <template v-slot:prepend>R$</template>
      </q-input>
      <q-input
        class="col-5 discount2"
        filled
        color="black"
        min="0"
        type="number"
        v-model="localDiscountPercentage"
        label=""
      >
        <template v-slot:prepend>%</template>
      </q-input>
    </div>
    <!-- Inputs para acréscimo -->
    <div class="row justify-center col-12 col-md-6">
      <q-input
        filled
        color="black"
        class="col-7 discount"
        type="number"
        min="0"
        v-model="localIncreaseValue"
        label="Acréscimo Unitário"
      >
        <template v-slot:prepend>R$</template>
      </q-input>
      <q-input
        filled
        color="black"
        class="col-5 discount2"
        type="number"
        min="0"
        v-model="localIncreasePercentage"
        label=""
      >
        <template v-slot:prepend>%</template>
      </q-input>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  initialPrice: {
    type: Number,
  },
  currentQuantityRef: {
    type: Number,
    default: 1,
  },
  resetFields: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["finalPriceUpdated", "unitPriceUpdated"]);

// Valores internos de desconto e acréscimo
const localDiscountValue = ref("0.00");
const localDiscountPercentage = ref("0.0");
const localIncreaseValue = ref("0.00");
const localIncreasePercentage = ref("0.0");

/// Computed para calcular o valor unitário sem ser afetado pela quantidade
const unitProductValue = computed(() => {
  let productPrice = parseFloat(props.initialPrice) || 0;

  // Aplicar o desconto unitário primeiro
  if (parseFloat(localDiscountValue.value) > 0) {
    productPrice -= parseFloat(localDiscountValue.value);
  }

  // Aplicar o acréscimo unitário
  if (parseFloat(localIncreaseValue.value) > 0) {
    productPrice += parseFloat(localIncreaseValue.value);
  }

  // Aplicar o acréscimo percentual sobre o novo valor
  if (parseFloat(localIncreasePercentage.value) > 0) {
    productPrice +=
      (productPrice * parseFloat(localIncreasePercentage.value)) / 100;
  }

  // Agora aplicar o desconto percentual sobre o valor após acréscimos
  if (parseFloat(localDiscountPercentage.value) > 0) {
    productPrice -=
      (productPrice * parseFloat(localDiscountPercentage.value)) / 100;
  }

  return productPrice.toFixed(2); // Valor unitário calculado
});

// Computed para calcular o valor final do produto (multiplicado pela quantidade)
const finalProductValue = computed(() => {
  const productPrice = parseFloat(unitProductValue.value);
  return (productPrice * parseFloat(props.currentQuantityRef)).toFixed(2);
});

// Watch para emitir o valor unitário (não afetado pela quantidade)
watch(unitProductValue, (newVal) => {
  emit("unitPriceUpdated", parseFloat(newVal) || 0.0);
});

// Watches para garantir que valores inválidos sejam corrigidos
watch(localDiscountValue, (newVal) => {
  if (newVal === "" || newVal === null || parseFloat(newVal) < 0) {
    localDiscountValue.value = "0.00";
  } else {
    localDiscountValue.value = parseFloat(newVal).toFixed(2);
  }
});

watch(localDiscountPercentage, (newVal) => {
  if (newVal === "" || newVal === null || parseFloat(newVal) < 0) {
    localDiscountPercentage.value = "0.0";
  } else {
    localDiscountPercentage.value = parseFloat(newVal).toFixed(1);
  }
});

watch(localIncreaseValue, (newVal) => {
  if (newVal === "" || newVal === null || parseFloat(newVal) < 0) {
    localIncreaseValue.value = "0.00";
  } else {
    localIncreaseValue.value = parseFloat(newVal).toFixed(2);
  }
});

watch(localIncreasePercentage, (newVal) => {
  if (newVal === "" || newVal === null || parseFloat(newVal) < 0) {
    localIncreasePercentage.value = "0.0";
  } else {
    localIncreasePercentage.value = parseFloat(newVal).toFixed(1);
  }
});

// Watch para emitir o valor final atualizado para o componente pai
watch(finalProductValue, (newVal) => {
  emit("finalPriceUpdated", parseFloat(newVal) || 0.0);
});

// Função para resetar os valores dos campos
function resetInputFields() {
  localDiscountValue.value = "0.00";
  localDiscountPercentage.value = "0.0";
  localIncreaseValue.value = "0.00";
  localIncreasePercentage.value = "0.0";
}

// Watch para observar a prop resetFields
watch(
  () => props.resetFields,
  (newVal) => {
    if (newVal === true) {
      resetInputFields();
    }
  }
);
</script>

<style scoped>
:deep(.discount .q-field__prepend) {
  color: #837c7c52;
  position: absolute;
}
:deep(.discount .q-field__control) {
  border-top-right-radius: 0;
}
:deep(.discount) {
  position: relative;
}
:deep(.discount::after) {
  content: "";
  position: absolute;
  width: 1px;
  height: 80%;
  background-color: #0000001f;
  right: 0;
  top: 10%;
}
:deep(.discount2 .q-field__control) {
  border-top-left-radius: 0;
}
:deep(.q-field__native) {
  font-size: 25px;
  text-align: right;
}
:deep(.q-field__control) {
  height: 65px;
  align-items: flex-end;
}
:deep(.q-field__prepend) {
  height: 100%;
  color: #837c7c52;
  padding-bottom: 8px;
  padding: 24px 5px 8px 0;
}
/* Remove as setas no Chrome, Safari, Edge, Opera */
:deep(input[type="number"])::-webkit-outer-spin-button,
:deep(input[type="number"])::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Remove as setas no Firefox */
:deep(input[type="number"]) {
  -moz-appearance: textfield;
}
</style>
