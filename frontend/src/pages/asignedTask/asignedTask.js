import { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import { isAuthenticated, Logout } from "../../services/Auth";
import { getUserData } from "../../services/storage";
import axios from "axios";

function AsignedTask() {
    axios.defaults.baseURL = "http://localhost:4040/api";
    const userdetails = getUserData();
    const navigate = useNavigate();

    const location = useLocation();
    const { details } = location.state || {};

    const [asignedTasks, setAsignedTasks] = useState({});
    

    const LogoutUser = () => {
            Logout();
            navigate("/");
          };
    if (!isAuthenticated()) {
            return <Navigate to="/" />;
    }
    
    const onclickTask = (task, e) => {
        e.preventDefault();
        const isConfirmed = window.confirm("Are you sure you want to change this Status?");
    
        if (!isConfirmed) {
          return;
        }
        axios.post("/task/update/complete",({token: userdetails.token, id: task._id})).then((response) =>{
          if (response.data.status){
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
          else{
            console.log("delete have some issue");
          }
        })
      }

    return ( <>
    <NavBar LogoutUser={LogoutUser} />
    <div className="container">
        <h2>Your Asigneded Project-Tasks Details</h2>
        <div className="row fw-bold text-center" style={{ fontSize: "14px" }}>
                <div className="col">#</div>
                <div className="col">Task</div>
                <div className="col">Description</div>
                <div className="col">Category</div>
                <div className="col">Deadline</div>
                <div className="col">Cost</div>
                <div className="col">Status</div>
                <div className="col"></div>
            </div>
        {details?.length ? (
            details.map((task, index) => (
                <div className="row fw-normal text-center py-2" style={{ fontSize: "14px" }}  key={task._id}>
                        <div className="col">{index + 1}</div>
                        <div className="col">{task.task}</div>
                        <div className="col">{task.description}</div>
                        <div className="col">{task.category}</div>
                        <div className="col">
                          {new Date(task.deadline).toISOString().split("T")[0]}
                        </div>
                        <div className="col">{task.cost} {task.currency}</div>
                        <div className={`col ${task.status === "pending" ? "text-danger" : "text-success"}`}> {task.status} </div>
                        <div className="col">
                          <a
                            href="#"
                            className="text-primary me-3"
                            onClick={(e) => onclickTask(task, e)}
                          >
                            Change-Status
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center mt-2">No tasks Asigned from you.</p>
                  )}
        
    </div>
    
    </>);
}
export default AsignedTask;