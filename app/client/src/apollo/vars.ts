import { makeVar } from "@apollo/client";
import { getCurrentMonth } from "../utils/date";
import { OptionInfo, OptionType } from "./types";
import produce from 'immer';

export const currentInstrument = makeVar<string>("");

export const currentOptionType = makeVar<OptionType>(OptionType.Standard);

export const currentExpiry = makeVar<string>(getCurrentMonth());

export const activeOption = makeVar<OptionInfo | null>(null);

export enum ShoppingAction { Buy, Sell };

export type ShoppingCartItem = {
    action: ShoppingAction
    option: OptionInfo
}

export const shoppingCart = makeVar<ShoppingCartItem[]>([]);

export function addToShoppingCart(action : ShoppingAction, option: OptionInfo) {
    shoppingCart(produce(shoppingCart(), cart => {
        cart.push({ action, option });
    }));
}

export function removeFromShoppingCart(item: ShoppingCartItem) {
    shoppingCart(produce(shoppingCart(), cart => {
        const i = cart.indexOf(item, 0);
        cart.splice(i, 1);
    }));
}