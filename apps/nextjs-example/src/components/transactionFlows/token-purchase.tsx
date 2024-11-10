// app/components/TokenPurchase.tsx
import React from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { isSendableNetwork } from '@/utils';
import { createClient } from '@/utils/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { useToast } from '../ui/use-toast';
import { redirect } from 'next/navigation';
const TokenPurchase = () => {
    const { toast } = useToast();

    const {
        account,
        connected,
        signAndSubmitTransaction,
        network
    } = useWallet();

    let sendable = isSendableNetwork(connected, network?.name);
    const supabase = createClient();

    const getUser = async (supabase: SupabaseClient) => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Error fetching user:', error);
            return null;
        }
        return data.user;
    };

    const handlePurchase = async () => {
        if (!connected || !account) {
            console.error('Wallet not connected');
            return;
        }

        const recipientAddress = process.env.PLATFORM_WALLET_ADDRESS || '0xYourPlatformWalletAddress'; // Replace with your platform wallet address
        const amount = 1; // Amount of tokens to send (in smallest unit)

        const payload = {
            type: 'entry_function_payload',
            function: '0x1::coin::transfer',
            type_arguments: ['0x1::aptos_coin::AptosCoin'],
            arguments: [recipientAddress, amount.toString()],
        };

        try {
            const user = await getUser(supabase);

            if (!user) {
                toast({ variant: 'destructive', title: 'No User Account Connected!', description: 'Login In Again.' })
                setTimeout(() => {
                    redirect("/login")
                }, 1500)
                return;
            }
            const response = await signAndSubmitTransaction(payload);
            console.log('Transaction response:', response);


            if (response && response.success) {  // Check if the transaction was successful
                const userId = user.id; // Replace with the actual user ID
                // Replace with the number of tokens to subtract

                const { data: currentData, error: fetchError } = await supabase
                    .from('your_table') // Replace with your table name
                    .select('your_field') // Select the field you want to update
                    .eq('condition_column', 'condition_value') // Specify your condition
                    .single(); // Fetch a single record

                if (fetchError) {
                    console.error('Error fetching current value:', fetchError);
                    return;
                }

                const currentValue = currentData.your_field; // Get the current value
                const newValue = currentValue + 10; // Add 10 to the current value

                const { data, error: updateError } = await supabase
                    .from('user_profiles') // Replace with your table name
                    .update({ your_field: newValue }) // Update with the new value
                    .eq('tokens_remaining', user.id)
                    .select();


                if (updateError) {
                    console.log('Debug:-->Got an error while Updating tokens')
                };
                console.log('Updated tokens:', data)

                console.log('Tokens updated successfully');
            }
        } catch (error) {
            console.error('Transaction or update failed:', error);
        }
    };

    return (
        <div>
            <h2>Token Purchase</h2>
            <button onClick={handlePurchase} disabled={!connected}>
                <Card>
                    <CardHeader>
                        <CardTitle>Purchase tokens</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        <Button onClick={handlePurchase} disabled={!sendable}>
                            Purchase tokens for our platform
                        </Button>
                    </CardContent>
                </Card>
            </button>
        </div>
    );
};

export default TokenPurchase;

