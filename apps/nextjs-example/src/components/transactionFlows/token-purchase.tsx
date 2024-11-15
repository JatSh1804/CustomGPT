// app/components/TokenPurchase.tsx
import React from 'react';
import Link from 'next/link'

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { isSendableNetwork } from '@/utils';
import { createClient } from '@/utils/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { useToast } from '../ui/use-toast';
import { redirect } from 'next/navigation';
import { InputTransactionData } from "@aptos-labs/wallet-adapter-core"

import { tiers } from '@/app/subscription/tier';

type TokenPurchaseProps = 'pro' | 'plus'; // Define valid plan values for the component;

const TokenPurchase = ({ plan }: { plan: 'plus' | 'pro' }) => {
    const { toast } = useToast();

    // const isValidPlan = (plan: string | null): plan is TokenPurchaseProps => {
    //     return plan === 'plus' || plan === 'pro';
    // };



    const [planCost, setPlanCost] = React.useState<50_000_000 | 10_000_000>(10_000_000);
    const [newToken, setNewToken] = React.useState<200 | 500>(200)

    React.useEffect(() => {
        if (plan == 'plus') {
            setPlanCost(10_000_000)
            setNewToken(200)
        } else {
            setPlanCost(50_000_000)
            setNewToken(500)
        }
    }, [plan])

    console.log('plan=>', plan, planCost)
    const {
        account,
        connected,
        signAndSubmitTransaction,
        network
    } = useWallet();
    const getTokenByPlanName = (planName: TokenPurchaseProps) => {
        const tier = tiers.find(tier => tier.name === planName);
        return tier ? tier.token : null; // Return the token if found, otherwise return null
    };

    const tokens = getTokenByPlanName(plan);

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

        const recipientAddress = process.env.PLATFORM_WALLET_ADDRESS || '0xe25dad8c19ffaa8fc03696990b85acbd4adc9f8077ebf4a1d97eaf3a628a61b1'; // Replace with your platform wallet address
        const amount = planCost; // Amount of tokens to send (in smallest unit)
        console.log('Debug:-->SenderAddress:', account.address)
        console.log('Debug:-->RecipientAddress', recipientAddress);

        const payload: InputTransactionData = {
            data: {
                // type: 'entry_function_payload',
                function: '0x1::aptos_account::transfer_coins',
                typeArguments: ['0x1::aptos_coin::AptosCoin'],
                functionArguments: [recipientAddress, amount],
            }
        };
        console.log('DEBUG:-->Payload', payload)
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


            if (response && response.hash) {  // Check if the transaction was successful
                const userId = user.id; // Replace with the actual user ID
                // Replace with the number of tokens to subtract
                console.log('Debug:-->AuthId:', userId)
                console.log('Debug:-->Updating the User tokens')
                const { data: currentData, error: fetchError } = await supabase
                    .from('user_profiles') // Replace with your table name
                    .select('tokens_remaining') // Select the field you want to update
                    .eq('auth_id', userId) // Specify your condition
                    .single(); // Fetch a single record

                if (fetchError) {
                    console.error('Error fetching current value:', fetchError);
                    return;
                }

                const currentValue = currentData.tokens_remaining; // Get the current value
                const newValue = currentValue + newToken; // Add 10 to the current value

                const { data, error: updateError } = await supabase
                    .from('user_profiles') // Replace with your table name
                    .update({ tokens_remaining: newValue }) // Update with the new value
                    .eq('auth_id', userId)
                    .select();


                if (updateError) {
                    console.log('Debug:-->Got an error while Updating tokens:', updateError)
                };
                console.log('Updated tokens:', data)

                toast({ variant: 'default', title: 'Transaction Successfull!', description: `${tokens} are added in your ${<Link href='/profile'>profile</Link>}.` })
                console.log('Tokens updated successfully');
            }
        } catch (error) {
            console.error('Transaction or update failed:', error);
        }

    };

    return (
        <div>
            <h2>Token Purchase</h2>
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
        </div>
    );
};

export default TokenPurchase;

