import { Navigate , Link, useNavigate} from 'react-router-dom';
// import NavBar from '../components/NavBar';
import NavBar from '../../components/NavBar';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import axios from "axios";
import { isAuthenticated, Logout } from '../../services/Auth';
import { useState } from 'react';
// import { storeUserData } from '../services/storage';

function Dashboard(){
  axios.defaults.baseURL = 'https://project-management-tool-server-16w1.onrender.com/api';
    const navigate = useNavigate(); 
    // const [isToggle, setIsToggle] = useState(false);
    const [toggleStates, setToggleStates] = useState({});

    const details = [
      { id: 1, title: "aula project", description: "sch", category: "Governemnt", deadline: "2025-02-28", creatorId: "6798b352a0cb7da538f2ccc9" },
      { id: 2, title: "cure project", description: "city", category: "private", deadline: "2025-02-28", creatorId: "6798b352a0cb7da538f2ccc9" },
    ]; 
    const tasks = [
      {
        id: 1,
        projectId: 1,
        userId: "",
        task: "Design database schema",
        description: "Create and optimize a database schema for the application.",
        category: "Development",
        deadline: "2025-03-15",
        cost: 1000,
        currency: "USD",
        creatorId: "6798b352a0cb7da538f2ccc9",
        status: "pending",
      },
      {
        id: 2,
        projectId: 2,
        userId: "",
        task: "Develop frontend UI",
        description: "Build a responsive user interface using React.",
        category: "Frontend",
        deadline: "2025-04-01",
        cost: 2000,
        currency: "USD",
        creatorId: "6798b352a0cb7da538f2ccc9",
        status: "pending",
      },
      {
        id: 3,
        projectId: 1,
        userId: "",
        task: "Integrate APIs",
        description: "Connect backend APIs with the frontend and test functionality.",
        category: "Integration",
        deadline: "2025-04-20",
        cost: 1500,
        currency: "USD",
        creatorId: "6798b352a0cb7da538f2ccc9",
        status: "pending",
      },
    ];    

    const onclickHandle = (project, type, e) => {
      e.preventDefault();
      navigate("/form-details", {
        state: { project, type }, // Pass the data as state
      });
    };
    const HandleDelete = (id,e) => {
      e.preventDefault();
      console.log(id,e,'-------e');
      // axios.post('/delete',id).then((response)=> {
      //   if (response.data.status){ 
      //     console.log('===ok'); 
      //     axios.get('ALL_EMPLOYEE_DETAILS_URL').then((resEmployee) => {
      //       // console.log(resEmployee,"emp")
      //       navigate("/employeeDetails"
      //       , {
      //           state: { details: resEmployee.data },
      //         });
      //     });
      //   }
      // });
    };
    
    const onclickTask = (task, type, e) => {
      e.preventDefault();
      navigate("/form-task-details", {
        state: { task, type }, // Pass the data as state
      });
    };
    const taskHandleDelete = (id,e) => {
      e.preventDefault();
      console.log(id,e,'-------e');
      // axios.post('/delete',id).then((response)=> {
      //   if (response.data.status){ 
      //     console.log('===ok'); 
      //     axios.get('ALL_EMPLOYEE_DETAILS_URL').then((resEmployee) => {
      //       // console.log(resEmployee,"emp")
      //       navigate("/employeeDetails"
      //       , {
      //           state: { details: resEmployee.data },
      //         });
      //     });
      //   }
      // });
    };
    // const ToggleProjectView = (task, e) => {
    //   e.preventDefault();
    //   if(isToggle){
    //     setIsToggle(false);
    //   }
    //   else{
    //     setIsToggle(true);
    //   }
    // };
    const toggleProjectView = (projectId, e) => {
      e.preventDefault();
      setToggleStates((prevState) => ({
        ...prevState,
        [projectId]: !prevState[projectId], // Toggle the state for the specific project ID
      }));
    };

    const renderedProjects = details.map((project) => {
      const projectTasks = tasks.filter((task) => task.projectId === project.id); 
  
      return (
        <tr key={project.id}>
          <th scope="row">{project.id}</th>
          <td>{project.title}</td>
          <td>{project.description}</td>
          <td>{project.category}</td>
          <td>{project.deadline}</td>
          <td>
            <form>
              <button  className="btn btn-primary" onClick={(e) => onclickHandle(project,'Manage',e)}>Update</button>
              <button  className="btn btn-secondary" onClick={(e) => HandleDelete(project.id, e)}>Delete</button>
              <button  className="btn btn-secondary" onClick={(e) => toggleProjectView(project.id, e)}>View Tasks</button>
            </form>
          </td>
          {toggleStates[project.id] && (
          <td colSpan="6">
            <table className="table table-bordered mt-2">
              <thead>
                <tr>
                  <th scope="col">Task ID</th>
                  <th scope="col">Task</th>
                  <th scope="col">Description</th>
                  <th scope="col">Category</th>
                  <th scope="col">Deadline</th>
                  <th scope="col">Cost</th>
                  <th scope="col">Currency</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {projectTasks.map((task) => (
                  <tr key={task.id}>
                    <th scope="row">{task.id}</th>
                    <td>{task.task}</td>
                    <td>{task.description}</td>
                    <td>{task.category}</td>
                    <td>{task.deadline}</td>
                    <td>{task.cost}</td>
                    <td>{task.currency}</td>
                    <td>
                      <form>
                        <button  className="btn btn-primary" onClick={(e) => onclickTask(task,'Manage',e)}>Update</button>
                        <button  className="btn btn-secondary" onClick={(e) => taskHandleDelete(task.id, e)}>Delete</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        )}
        </tr>
      );
    });
    const LogoutUser = () => {
        Logout();
        return navigate("/");
    } 
    if (!isAuthenticated()) {
        return < Navigate to="/" />
    }
  return (
    <>
        <NavBar LogoutUser={LogoutUser} />
        <h2>Your Created Project Details</h2>
        <Link className="nav-link" onClick={(e) => onclickHandle('','Add',e)} >Add New Projects</Link>
        <table className="table caption-top bg-white rounded">
          <caption className="text-white fs-4">Recent Projects</caption>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">category</th>
              <th scope="col">deadline</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
          {renderedProjects}
          </tbody>
        </table>
        
        {/* <p>Details: {data.data[0].username}</p> */}
        
    </>);
}


export default Dashboard;