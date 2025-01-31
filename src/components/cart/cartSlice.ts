import { RootState } from "@lib/store/store";
import { CartItem, ProductById } from "@lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { cart: CartItem[] } = {
  //   cart: JSON.parse(sessionStorage.getItem("cart") || "[]"),
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action: PayloadAction<ProductById>) {
      // 1. check if the same items with the same properties exist in the cart.
      // 2. if so find it.
      const sameItem = state.cart.find((item) => item.id === action.payload.id);

      // 3. set a unique id so we can find that varient of the product later on just so the user could delete or increase/decrease it's quantity  form the cart, and then add increase the quantity of the the product by the amount requested.
      if (sameItem) {
        sameItem.quantity++;

        sameItem.totalPrice = sameItem.salePrice * sameItem.quantity;
      } else {
        // 4. Else if the product doesn't exist already in the cart just add it. that way if the user adds it again the above will apply.
        state.cart.push({
          ...action.payload,
          quantity: 1,
          totalPrice: action.payload.salePrice,
        });
      }
    },
    // here we are deleting the prodcut with the itemId, becasue every product can be bought with different color/size
    deleteCartItem(state, action: PayloadAction<number>) {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },

    // deleteAllRelatedItems(state, action) {
    //   state.cart = state.cart.filter((item) => item.id !== action.payload);
    // },
    increaseItemQuantity(state, action: PayloadAction<number>) {
      const item = state.cart.find((item) => item.id === action.payload);

      if (item && item.stock) {
        if (item.quantity === item.stock) return;
        item.quantity++;
        item.totalPrice = item.salePrice * item.quantity;
      }
    },

    decreaseItemQuantity(state, action: PayloadAction<number>) {
      const item = state.cart.find((item) => item.id === action.payload);

      if (item && item.stock) {
        if (item.quantity === 0) return;
        item.quantity--;

        item.totalPrice = item.quantity * item.salePrice;

        if (item.quantity === 0)
          cartSlice.caseReducers.deleteCartItem(state, action);
      }
    },

    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItemToCart,
  deleteCartItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = (state: RootState) => state.cartData.cart;

export const getTotalItemQuantity = (state: RootState) =>
  state.cartData.cart.reduce((sum, curEl) => sum + curEl.quantity, 0);

export const getTotalCartPrices = (state: RootState) =>
  state.cartData.cart.reduce((sum, curEl) => sum + curEl.totalPrice, 0);
