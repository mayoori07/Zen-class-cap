import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../services/Auth";
import { getProject_detail } from "../services/API";
import { getUserData } from "../services/storage";
import axios from "axios";

export default function NavBar(props) {
  const navigate = useNavigate();
  const userdetails = getUserData()

  const onClickProjectDetails = (e) => {
     e.preventDefault();
    //  const d= getProject_detail(userdetails.token)
    axios.post(`http://localhost:4040/api/project/index`, {token: userdetails.token,
    })
    .then((res) => {
      navigate("/dashboard", {
        state: { details: res.data.data },
      });
    }).catch((err) => {
      console.log(err);
    });         
  }
  const onClickTasksAsignedDetails = (e) =>{
    e.preventDefault();
    
    axios.post(`http://localhost:4040/api/task/mine`, {token: userdetails.token,
    })
    .then((res) => {
      navigate("/Asinged-Task-Dashboard", {
        state: { details: res.data.tasks },
      });
    }).catch((err) => {
      console.log(err);
    });   
  }
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <Link className="navbar-brand pe-5" to="/">
        PMT-Project
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          {!isAuthenticated() && (
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
          )}
          {!isAuthenticated() && (
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Login
              </Link>
            </li>
          )}
          {isAuthenticated() && (
            <li className="nav-item">
              <Link className="nav-link"  onClick={onClickProjectDetails}>
                My-Project-Dashboard
              </Link>
            </li>
          )}
          {isAuthenticated() && (
            <li className="nav-item">
              <Link className="nav-link"  onClick={onClickTasksAsignedDetails}>
                Asigned-Tasks-Dashboard
              </Link>
            </li>
          )}
          {isAuthenticated() && (
            <li className="nav-item">
              <Link className="nav-link" to="/form-details">
                Projects-Form
              </Link>
            </li>
          )}
          {isAuthenticated() && (
            <li className="nav-item">
              <Link className="nav-link" to="/form-task-details">
                Tasks-Form
              </Link>
            </li>
          )}
          {isAuthenticated() && (
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={props.LogoutUser}
                style={{ textDecoration: "none" }}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
