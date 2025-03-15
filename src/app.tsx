import { useAuth } from "./components/auth/authprovider";
import Login from "./components/auth/login";
import NoGroup from "./components/group/no-group";
import Popup from "./components/popup/popup";


const App: React.FC = () => {
    const { user, group } = useAuth(); 

    if (!user) {
        return <Login/>;
    }

    return <div>{group ? <Popup/> : <NoGroup/>}</div>;
};

export default App;