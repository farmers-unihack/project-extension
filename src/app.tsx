import { useAuth } from "./auth/authprovider";
import Login from "./auth/login";
import Popup from "./popup/popup";


const App: React.FC = () => {
    const { user } = useAuth(); 

    return <div>{user ? <Popup /> : <Login />}</div>;
};

export default App;