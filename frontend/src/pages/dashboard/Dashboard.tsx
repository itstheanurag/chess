import { useAuth } from "../../hooks/useAuth";

const Dashboard = () => {
    const { user, logOut } = useAuth();

    return (
      <div>
        <h1>Welcome, {user?.name || "Guest"}!</h1>
        <button onClick={logOut}>Log Out</button>
      </div>
    );
}

export default Dashboard