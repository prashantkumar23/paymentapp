import Link from "next/link";
import { useUser } from "../context/user";

const Nav = () => {
  const { user, isLoading } = useUser();
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/pricing">Pricing</Link>
      {!!user && <Link href="/profile">Profile</Link>}

      {!isLoading && (
        <Link href={user ? "/profile" : "/login"}>
          {user ? "Logout" : "Login"}
        </Link>
      )}
    </nav>
  );
};

export default Nav;
