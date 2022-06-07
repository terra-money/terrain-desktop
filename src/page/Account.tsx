import AccountView from "../component/AccountView";
import { useTerra } from "../package";
export default function AccountsPage() {
  const { getTestAccounts } = useTerra();
  return (
    <ul className="w-full flex flex-col">
      {getTestAccounts().map((w) => (
        <AccountView wallet={w} />
      ))}
    </ul>
  );
}
