module disperseonsui::disperse{
    use sui::coin::{Self,Coin};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::vector;

    fun transfer_coin<T>(coin: &mut Coin<T>, amount: u64, recipient: address,ctx: &mut TxContext) {
        let balance = coin::balance_mut(coin);
        let new_coin = coin::take(balance, amount, ctx);

        transfer::public_transfer(new_coin, recipient);
    }   


    public entry fun disperse<T>(coin: &mut Coin<T>, amounts: vector<u64>, recipients: vector<address>, ctx: &mut TxContext) {
        let i : u64 = 0;
        let len = vector::length(&recipients);

        while (i < len) {
            let amount = vector::borrow(&mut amounts, i);
            let recipient = vector::borrow(&mut recipients, i);
            transfer_coin(coin, *amount, *recipient, ctx);
            i = i + 1;
        }
    }
}