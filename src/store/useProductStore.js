// stores/useProductStore.js
import { defineStore } from "pinia";

export const useProductStore = defineStore("productStore", {
  state: () => ({
    productList: JSON.parse(localStorage.getItem("productList")) || [],
  }),
  actions: {
    addProducts(productArray) {
      this.productList.push(...productArray);
      this.saveToLocalStorage();
    },
    removeProducts(index) {
      this.productList.splice(index, 1);
      this.saveToLocalStorage();
    },
    clearProductList() {
      this.productList = [];
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      localStorage.setItem("productList", JSON.stringify(this.productList));
    },
  },
});
