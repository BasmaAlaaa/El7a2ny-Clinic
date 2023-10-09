import MainBtn from './Button';
import logo from '../assets/images/svg/logo.svg';
import notify from '../assets/images/svg/notification.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showUserDrop } from '../features/userDropDown.js';
import DropDown from './Dropdown.jsx';

function NavBarAdministrator() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login.loggedIn);

  return (
    <nav className="navbar shadow-sm mb-4">
      <div className="d-flex flex-row justify-content-between w-100 align-items-center">
        <div className="d-flex flex-row">
          <a className="navbar-brand">
            <img src='https://i.pinimg.com/originals/57/1a/e3/571ae39ce1b3360b0cf852322b413bdb.jpg' alt="Pharmacy" width={40} height={40} />
          </a>
          {login && (
            <div className="d-flex flex-column align-items-center justify-content-center m-0 ms-sm-5">
              <Link className="nav-list green-txt">Cases</Link>
              <hr className="m-0 mt-1" />
            </div>
          )}
        </div>

        {login ? (
          <div>
            <div className="d-flex flex-row align-items-center">
              <img src={notify} />
              <DropDown
                txt="ah"
                className="bg-green text-uppercase rounded-5 p-1 ms-2 ms-sm-4 me-2 border-0"
              />
              <p className="text-capitalize">dr. ahmed hussam</p>
            </div>
          </div>
        ) : (
          <div>
            <MainBtn
              txt="Home"
              style="green-btn"
              action={() => navigate('/pharmacistView')}
              key="navBtn"
            />
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBarAdministrator;
