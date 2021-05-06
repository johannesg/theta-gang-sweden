import { makeVar } from "@apollo/client";
import { getCurrentMonth  } from '@theta-gang/shared/src/date';
import { OptionDetails, OptionType } from "./types";
import produce from 'immer';

export const currentInstrument = makeVar<string>("");

export const currentOptionType = makeVar<OptionType>(OptionType.Standard);

export const currentExpiry = makeVar<string>(getCurrentMonth());

export const activeOption = makeVar<OptionDetails | null>(null);

export enum ShoppingAction { Buy = "Buy", Sell = "Sell" };

export type ShoppingCartItem = {
    action: ShoppingAction
    price: number
    option: OptionDetails
}

export const shoppingCart = makeVar<ShoppingCartItem[]>([]);

export function addToShoppingCart(action: ShoppingAction, option: OptionDetails) {
    const buy = option?.bid ?? 0;
    const sell = option?.ask ?? 0;
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

export function isInShoppingCart(cart: ShoppingCartItem[], option: OptionDetails): ShoppingAction | undefined {
    const item = shoppingCart().find(si => si.option === option);
    if (item) {
        console.log(`Found ${item.option.name}`);
        return item.action;
    }
    return undefined;
}