import MainBtn from './Button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function NavBarPatient(props) {
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
        </div>

        <div>
            <MainBtn
              txt="Home"
              style="green-btn"
              action={() => navigate(`/patientView/${props.username}`)}
              key="navBtn"
            />
          </div>
          <div>
            <MainBtn
              txt="Logout"
              style="green-btn"
              // action={() => navigate('/administratorView')}
              key="navBtn"
            />
          </div>
        
      </div>
    </nav>
  );
}

export default NavBarPatient;
