'use client'

import { PropsWithChildren } from 'react'
import { PetraWallet } from 'petra-plugin-wallet-adapter'
import { WalletProvider } from '@/components/WalletProvider'
// import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
// import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design'
import React from 'react'
// import {
// Aptos,
// AptosConfig,
// Network,
// APTOS_COIN,
// AccountAddressInput,
// } from '@aptos-labs/ts-sdk'
// import { Network } from '@aptos-labs/ts-sdk'

const wallets = [new PetraWallet()]
export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <body className="grow">
            <WalletProvider>
                <div className="mt-16">{children}</div>
            </WalletProvider>
        </body>
    )
}