import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
// import NavBar from '../components/NavBar';
import NavBar from "../../components/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import axios from "axios";
import { isAuthenticated, Logout } from "../../services/Auth";
import { useState } from "react";
import { getUserData } from "../../services/storage";
import { DeleteProject, getProject_detail } from "../../services/API";
// import { storeUserData } from '../services/storage';

function Dashboard() {
  axios.defaults.baseURL = "https://project-management-tool-server-16w1.onrender.com/api";
  const userdetails = getUserData();
  const navigate = useNavigate();

  const location = useLocation();
  const { details } = location.state || {};
  const [toggleStates, setToggleStates] = useState({});
  const [activeProjectId, setActiveProjectId] = useState(null);
  

  const onclickHandle = (project, type, e) => {
    e.preventDefault();
    navigate("/form-details", {
      state: { project, type }, // Pass the data as state
    });
  };
  const HandleDelete = (id, e) => {
    e.preventDefault();
    const isConfirmed = window.confirm("Are you sure you want to delete this project?");

    if (!isConfirmed) {
      return;
    }
    axios.post("/project/destroy",({token: userdetails.token, id: id})).then((response) =>{
      if (response.data.status){
        axios.post(`https://project-management-tool-server-16w1.onrender.com/api/project/index`, {token: userdetails.token,
        })
        .then((res) => {
          navigate("/dashboard", {
            state: { details: res.data.data },
          });
        }).catch((err) => {
          console.log(err);
        });      
      }
      else{
        console.log("delete have some issue");
      }
    })
  };

  const onclickTask = (task, type, e, projectId) => {
    e.preventDefault();
    navigate("/form-task-details", {
      state: { task, type, projectId },
    });
  };
  const taskHandleDelete = (id, e) => {
    e.preventDefault();
    const isConfirmed = window.confirm("Are you sure you want to delete this project?");

    if (!isConfirmed) {
      return;
    }
    // axios.post("/project/destroy",({token: userdetails.token, id: id})).then((response) =>{
    //   if (response.data.status){
    //     axios.post(`http://localhost:4040/api/project/index`, {token: userdetails.token,
    //     })
    //     .then((res) => {
    //       navigate("/dashboard", {
    //         state: { details: res.data.data },
    //       });
    //     }).catch((err) => {
    //       console.log(err);
    //     });      
    //   }
    //   else{
    //     console.log("delete have some issue");
    //   }
    // })
  };

  const toggleProjectView = async (project, e) => {
    e.preventDefault();
    setActiveProjectId(project._id); 
    setToggleStates([]);

    try {
      const res = await axios.post(`https://project-management-tool-server-16w1.onrender.com/api/project/show`, {
        token: userdetails.token,
        project_id: project._id,
      });
      console.log(res,'---res');
      setToggleStates(res.data.tasks || []);
    } catch (err) {
      setToggleStates([]);
      console.log("Error fetching tasks:", err);
    }
  };

  const LogoutUser = () => {
    Logout();
    return navigate("/");
  };
  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <NavBar LogoutUser={LogoutUser} />
      <div className="container">
        <h2>Your Created Project Details</h2>
        <Link
          className="btn btn-primary"
          onClick={(e) => onclickHandle("", "Add", e)}
        >
          Add New Projects
        </Link>

        <div className="row text-center">
          <div className="col fw-bold">ID</div>
          <div className="col fw-bold">Title</div>
          <div className="col fw-bold">Description</div>
          <div className="col fw-bold">category</div>
          <div className="col fw-bold">deadline</div>
          <div className="col fw-bold"></div>
        </div>
        {details?.length ? (
          details.map((project, index) => (
            <div key={project._id}>
              <div className="row text-center align-items-center py-2">
                <div className="col">{index + 1}</div>
                <div className="col">{project.title}</div>
                <div className="col">{project.description}</div>
                <div className="col">{project.category}</div>
                <div className="col">{new Date(project.deadline).toISOString().split("T")[0]}</div>
                <div className="col">
                  <a
                    href="#"
                    className="text-primary me-3"
                    onClick={(e) => onclickHandle(project, "Manage", e)}
                  >
                    Update
                  </a>
                  <a
                    href="#"
                    className="text-danger me-3"
                    onClick={(e) => HandleDelete(project._id, e)}
                  >
                    Delete
                  </a>
                  <a
                    href="#"
                    className="text-success"
                    onClick={(e) => toggleProjectView(project, e)}
                  >
                    Tasks
                  </a>
                </div>
              </div>

              {activeProjectId === project._id && (
                <div className="container-fluid mt-3 p-3 border rounded bg-light">
                  <h5>Tasks for {project.title}</h5>
                  <Link
                    className="btn btn-primary"
                    onClick={(e) => onclickTask("", "Add", e, project._id)}
                  >
                    Add New Task
                  </Link>
                  <div className="row fw-bold text-center" style={{ fontSize: "14px" }}>
                    <div className="col">#</div>
                    <div className="col">Task</div>
                    <div className="col">Description</div>
                    <div className="col">Category</div>
                    <div className="col">Deadline</div>
                    <div className="col">Cost</div>
                    <div className="col">Status</div>
                    <div className="col">AsignedPerson</div>
                  </div>

                  {toggleStates.length > 0 ? (
                    toggleStates.map((task, index) => (
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
                        <div className="col">{task.userId.username}</div>
                        {/* <div className="col">
                          <a
                            href="#"
                            className="text-primary me-3"
                            onClick={(e) => onclickTask(task, "Manage", e, project._id)}
                          >
                            Update
                          </a>
                          <a
                            href="#"
                            className="text-danger"
                            onClick={(e) => taskHandleDelete(task._id, e)}
                          >
                            Delete
                          </a>
                        </div> */}
                      </div>
                    ))
                  ) : (
                    <p className="text-center mt-2">No tasks found.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center mt-3">No projects found.</p>
        )}
      </div>
    </>
  );
}

export default Dashboard;
