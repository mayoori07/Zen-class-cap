import { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import axios from "axios";
import { isAuthenticated, Logout } from "../../services/Auth";
import { getUserData } from "../../services/storage";

function FormTask() {
    const navigate = useNavigate();
    const userdetails = getUserData();
    const location = useLocation();
    const { task, type, projectId } = location.state || {};
    
    axios.defaults.baseURL = "http://localhost:4040/api";
  const [isAdd, setIsAdd] = useState(false);
  const [users, setUsers] = useState({});
  const [inputs, setInputs] = useState({
    token:userdetails.token,
    project_id: projectId,
    user_id: "",
    userName: "",
    task: "",
    cost: "",
    currency: "",
    description: "",
    category: "",
    deadline: "",
  });

  // UseEffect to handle initialization based on `type`
  useEffect(() => {
    if (type === "Manage" && task) {
      setIsAdd(true);
      setInputs({
        token:userdetails.token,
        project_id: projectId,
        user_id: task.userId._id,
        userName: task.userId.username,
        task: task.task,
        cost: task.cost,
        currency: task.currency,
        description: task.description,
        category: task.category,
        deadline: new Date(task.deadline).toISOString().split("T")[0],
      });
    }
  }, [type, task]);

  // Error state
  const initialStateErrors = {
    // user_id: { required: false },
    task: { required: false },
    currency: { required: false },
    cost: { required: false },
    description: { required: false },
    category: { required: false },
    deadline: { required: false },
    custom_error: null,
  };
  const [errors, setErrors] = useState(initialStateErrors);

  // Loading state
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    let error = initialStateErrors;
    let hasError = false;

    // if (!inputs.user_id) {
    //   error.user_id.required = true;
    //   hasError = true;
    // }
    if (!inputs.task) {
      error.task.required = true;
      hasError = true;
    }
    if (!inputs.description) {
      error.description.required = true;
      hasError = true;
    }
    if (!inputs.category) {
      error.category.required = true;
      hasError = true;
    }
    if (!inputs.cost) {
      error.cost.required = true;
      hasError = true;
    }
    if (!inputs.currency) {
      error.currency.required = true;
      hasError = true;
    }
    if (!inputs.deadline) {
      error.deadline.required = true;
      hasError = true;
    }

    if (!hasError) {
      console.log(inputs);
      const apiCall = isAdd
        ? axios.post("/task/update/complete", inputs)
        : axios.post("/task/store", inputs);

      apiCall.then((response)=>{
        console.log(response,'-----responsehdhtd');
        if (response.data.status){
          
          axios.post(`http://localhost:4040/api/project/index`, {token: userdetails.token,
          })
          .then((res) => {
            alert("Operation done Sucessfull ")
            navigate("/dashboard", {
              state: { details: res.data.data },
            });
          }).catch((err) => {
            console.log(err);
          });         
        }
        else{
        setErrors({...errors,custom_error:response.data.message
        })
      }
    }).catch((err)=>{
        console.log(err);
    }).finally(()=>{
        setLoading(false);
    })
    }

    setErrors({ ...error });
  };

  const handleInputs = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    axios.get(`http://localhost:4040/api/get-users`, { token: userdetails.token })
      .then((res) => {
        console.log(res, '----res');
        setUsers(res.data.data || []); // Update the state with fetched users
      })
      .catch((err) => {
        setUsers([])
        console.log(err);
      });
  }, []);
    const LogoutUser = () => {
        Logout();
        navigate("/");
      };
    if (!isAuthenticated()) {
        return <Navigate to="/" />;
      }
    return (
        <>
        <NavBar LogoutUser={LogoutUser} />
        <section className="register-block">
        <div className="container">
          <div className="row">
            <div className="col register-sec">
              <h2 className="text-center">{isAdd ? "Update Task" : "Add Task"}</h2>
              <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title" className="text-uppercase">
                    User Name
                  </label>
                  <select 
                      className="form-control" 
                      value={inputs.user_id} 
                      name="user_id" 
                      onChange={(e) => {
                        const selectedUser = users.find(user => user._id === e.target.value);
                        setInputs({
                          ...inputs,
                          user_id: e.target.value,
                          userName: selectedUser ? selectedUser.username : "",
                        });
                      }}
                    >
                      <option value="">Select User</option>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.username}
                          </option>
                        ))
                      ) : (
                        <option disabled>No users registered yet</option>
                      )}
                    </select>
                </div>
                <div className="form-group">
                  <label htmlFor="task" className="text-uppercase">
                      Task
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={inputs.task}
                    onChange={handleInputs}
                    name="task"
                  />
                  {errors.task.required && (
                    <span className="text-danger">task is required.</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="description" className="text-uppercase">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={inputs.description}
                    onChange={handleInputs}
                    name="description"
                  />
                  {errors.description.required && (
                    <span className="text-danger">Description is required.</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="category" className="text-uppercase">
                    Category
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={inputs.category}
                    onChange={handleInputs}
                    name="category"
                  />
                  {errors.category.required && (
                    <span className="text-danger">Category is required.</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="deadline" className="text-uppercase">
                    Deadline
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={inputs.deadline}
                    onChange={handleInputs}
                    name="deadline"
                  />
                  {errors.deadline.required && (
                    <span className="text-danger">Deadline is required.</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="cost" className="text-uppercase">
                    cost
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={inputs.cost}
                    onChange={handleInputs}
                    name="cost"
                  />
                  {errors.cost.required && (
                    <span className="text-danger">cost is required.</span>
                  )}
                </div>
                <div className="form-group">
                    <div className="form-group">
                  <label htmlFor="currency" className="text-uppercase">
                  currency
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={inputs.currency}
                    onChange={handleInputs}
                    name="currency"
                  />
                  {errors.currency.required && (
                    <span className="text-danger">currency is required.</span>
                  )}
                </div>
      
                  {errors.deadline.required && (
                    <span className="text-danger">Deadline is required.</span>
                  )}
                </div>
                <div className="form-group">
                  {errors.custom_error && (
                    <span className="text-danger">{errors.custom_error}</span>
                  )}
                  {loading && (
                    <div className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  )}
                  <br></br>
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value={isAdd ? "Update Task" : "Add Task"}
                  />
                  <br></br>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default FormTask;