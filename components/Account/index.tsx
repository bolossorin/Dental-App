import { AccountInfoBlock } from "./Info";
import { AccountUpgradeBlock } from "./Upgrate";

interface AccountProps {}

export const Account: React.FC<AccountProps> = () => {
  return (
    <>
      <AccountInfoBlock />
      <AccountUpgradeBlock />
    </>
  );
};
