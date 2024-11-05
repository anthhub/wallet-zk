import { ViewMnemonic } from "./ViewMnemonic";
import { PinSetup } from "./PinSetup";
import { ImportWallet } from "./ImportWallet";
import { SendModal } from "./SendModal";
import { DappPermissionDialog } from "./DappPermission";
import type { ImportedWallet } from "../types/modal";
import type { WalletState } from "../types/wallet";

interface ModalsContainerProps {
  wallet: WalletState;
  pin: string | null;
  showImport: boolean;
  showMnemonic: boolean;
  showPinSetup: boolean;
  showSendModal: boolean;
  pendingPermission: string | null;
  onImport: (imported: ImportedWallet) => void;
  onPinSet: (pin: string) => void;
  onCloseModals: () => void;
}

export function ModalsContainer({
  wallet,
  pin,
  showImport,
  showMnemonic,
  showPinSetup,
  showSendModal,
  pendingPermission,
  onImport,
  onPinSet,
  onCloseModals,
}: ModalsContainerProps) {
  return (
    <>
      {showImport && pin && (
        <ImportWallet onImport={onImport} onClose={onCloseModals} pin={pin} />
      )}

      {showMnemonic && pin && (
        <ViewMnemonic pin={pin} onClose={onCloseModals} />
      )}

      {showPinSetup && <PinSetup onPinSet={onPinSet} onClose={onCloseModals} />}

      {showSendModal && (
        <SendModal
          onClose={onCloseModals}
          onSend={() => {
            // TODO: Implement send
            onCloseModals();
          }}
          balance={wallet.balance}
        />
      )}

      {pendingPermission && (
        <DappPermissionDialog
          origin={pendingPermission}
          metadata={{
            name: "DApp",
            url: "https://example.com",
          }}
          onApprove={() => {
            // TODO: Implement approve
            onCloseModals();
          }}
          onReject={onCloseModals}
        />
      )}
    </>
  );
}
