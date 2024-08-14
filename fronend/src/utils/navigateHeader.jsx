import { createBrowserHistory } from 'history';
import { useNavigate } from 'react-router-dom';

const history = createBrowserHistory();

export const navigateToLogin = () => {
  history.push('/login');
};

export default history;
