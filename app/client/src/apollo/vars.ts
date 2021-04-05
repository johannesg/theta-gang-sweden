import { makeVar } from "@apollo/client";
import { getCurrentMonth } from "../utils/date";
import { OptionInfo, OptionType } from "./types";
import produce from 'immer';

export const currentInstrument = makeVar<string>("");

export const currentOptionType = makeVar<OptionType>(OptionType.Standard);

export const currentExpiry = makeVar<string>(getCurrentMonth());

export const activeOption = makeVar<OptionInfo | null>(null);

export enum ShoppingAction { Buy = "Buy", Sell = "Sell" };

export type ShoppingCartItem = {
    action: ShoppingAction
    price: number
    option: OptionInfo
}

export const shoppingCart = makeVar<ShoppingCartItem[]>([]);

export function addToShoppingCart(action: ShoppingAction, option: OptionInfo) {
    const buy = option?.buy ?? 0;
    const sell = option?.sell ?? 0;
    const mid = (buy + sell) / 2;
    const price = action === ShoppingAction.Buy ? -mid : mid;

    shoppingCart(produce(shoppingCart(), cart => {
        cart.push({ action, price, option });
    }));
}

export function removeFromShoppingCart(item: ShoppingCartItem) {
    shoppingCart(produce(shoppingCart(), cart => {
        const i = cart.indexOf(item, 0);
        cart.splice(i, 1);
    }));
}

export function isInShoppingCart(cart: ShoppingCartItem[], option: OptionInfo): ShoppingAction | undefined {
    const item = shoppingCart().find(si => si.option === option);
    if (item) {
        console.log(`Found ${item.option.name}`);
        return item.action;
    }
    return undefined;
}