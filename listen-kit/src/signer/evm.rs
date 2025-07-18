use alloy::network::EthereumWallet;
use alloy::signers::local::PrivateKeySigner;
use anyhow::Result;
use async_trait::async_trait;
use std::str::FromStr;

use crate::evm::transaction::send_transaction;
use crate::evm::util::make_provider;

use super::TransactionSigner;

pub struct LocalEvmSigner {
    wallet: EthereumWallet,
}

impl LocalEvmSigner {
    pub fn new(private_key: String) -> Self {
        let wallet = EthereumWallet::from(
            PrivateKeySigner::from_str(&private_key)
                .expect("make evm PrivateKeySigner"),
        );
        Self { wallet }
    }
}

impl std::fmt::Debug for LocalEvmSigner {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "LocalEvmSigner({})",
            self.wallet.default_signer().address()
        )
    }
}

#[async_trait]
impl TransactionSigner for LocalEvmSigner {
    fn address(&self) -> Option<String> {
        Some(self.wallet.default_signer().address().to_string())
    }

    async fn sign_and_send_evm_transaction(
        &self,
        tx: alloy::rpc::types::TransactionRequest,
    ) -> Result<String> {
        send_transaction(tx, &make_provider(42161)?, &self.wallet).await
    }
}
