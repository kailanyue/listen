import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChatType } from "../hooks/useChatType";
import { ChatSelector } from "./ChatSelector";
import { ConnectedAccounts } from "./ConnectedAccounts";
import { WalletAddresses } from "./WalletAddresses";

export function Settings() {
  const { user } = usePrivy();
  const { chatType, setChatType } = useChatType();
  const [quickBuyAmount, setQuickBuyAmount] = useState<number>(0.1);

  const { t } = useTranslation();

  // Load saved quick buy amount from localStorage
  useEffect(() => {
    const savedAmount = localStorage.getItem("quickBuyAmount");
    if (savedAmount) {
      setQuickBuyAmount(parseFloat(savedAmount));
    }
  }, []);

  // Save quick buy amount to localStorage
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuickBuyAmount(value);
      localStorage.setItem("quickBuyAmount", value.toString());
    }
  };

  return (
    <div className="h-full overflow-auto px-4 scrollable-container">
      <h2 className="text-lg font-bold mb-2 mt-4">
        {t("settings.wallet_addresses")}
      </h2>
      <WalletAddresses />
      <h2 className="text-lg font-bold mb-2 mt-4">{t("settings.quick_buy")}</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 mb-4">
        <label className="block text-sm text-white mb-2">
          {t("settings.quick_buy_default_sol_amount")}
        </label>
        <div className="flex items-center">
          <input
            type="number"
            value={quickBuyAmount}
            onChange={handleAmountChange}
            min="0.01"
            step="0.01"
            className="bg-black/60 rounded-lg px-3 py-2 text-white w-24 focus:outline-none"
          />
          <span className="ml-2 text-white">SOL</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {t("settings.quick_buy_default_sol_amount_description")}
        </p>
      </div>

      <h2 className="text-lg font-bold mb-2 mt-4">{t("settings.mode")}</h2>
      <ChatSelector selectedChat={chatType} onSelectChat={setChatType} />

      <h2 className="text-lg font-bold mb-2 mt-4">
        {t("settings.connected_accounts")}
      </h2>
      {user && <ConnectedAccounts user={user} />}
    </div>
  );
}
