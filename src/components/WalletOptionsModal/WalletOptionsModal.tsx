import Image from "next/image";
import { useEffect } from "react";
import { useConnect } from "wagmi";

interface Props {
  open: boolean;
  setOpen: (showWalletOptions: boolean) => void;
  onConnect: (address: string) => void;
}

export default function WalletOptionsModal(props: Props) {
  const { open, setOpen, onConnect } = props;
  const {
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
    isConnected,
    data
  } = useConnect();

  useEffect(() => {
    if (open && isConnected) onConnect(data?.account);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return open ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative w-auto max-w-3xl mx-auto my-6">
          <div className="relative flex flex-col bg-white border-0 rounded-lg shadow-lg">
            <div className="flex items-center justify-around p-5 mb-4">
              <h3 className="text-3xl font-semibold text-left">
                Choose a Wallet
              </h3>
            </div>

            {connectors.length &&
              connectors.map((c) => (
                <div
                  key={c.id}
                  className="mb-2 ml-2 mr-2 w-80 flex justify-center"
                >
                  <button
                    disabled={!c.ready}
                    onClick={() => connect(c)}
                    className="w-full py-2 rounded-full border-2 border-blue-200"
                  >
                    <div className="flex justify-center items-center gap-4">
                      <Image
                        src={`/images/web3/wallet-${c.id}.svg`}
                        alt={c.name}
                        height={32}
                        width={32}
                      />
                      {c.name}
                      {!c.ready && " (unsupported)"}
                      {isConnecting &&
                        c.id === pendingConnector?.id &&
                        " (connecting)"}
                    </div>
                  </button>
                </div>
              ))}
            {error && (
              <div className="ml-2 text-red-500">
                {error?.message ?? "Failed to connect"}
              </div>
            )}

            <div className="flex items-center justify-end p-3 mt-1">
              <button
                className="px-6 py-2 mb-1 text-sm font-semibold text-red-500 uppercase"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;
}
