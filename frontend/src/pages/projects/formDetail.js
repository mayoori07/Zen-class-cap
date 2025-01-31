import { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import axios from "axios";
import { isAuthenticated, Logout } from "../../services/Auth";
import { getUserData } from "../../services/storage";

function FormDetails() {
  axios.defaults.baseURL = "http://localhost:4040/api";
  const navigate = useNavigate();
  const userdetails = getUserData();
  const location = useLocation();
  const { project, type } = location.state || {}; // Destructure the passed state
  const [isAdd, setIsAdd] = useState(false); // State for add mode
  const [inputs, setInputs] = useState({
    creatorId: userdetails.id,
    token:userdetails.token,
    id: "",
    title: "",
    description: "",
    category: "",
    deadline: "",
  });

  // UseEffect to handle initialization based on `type`
  useEffect(() => {
    if (type === "Manage" && project) {
      setIsAdd(true);
      setInputs({
        creatorId: userdetails.id,
        id:project._id,
        token:userdetails.token,
        title: project.title,
        description: project.description,
        category: project.category,
        deadline: new Date(project.deadline).toISOString().split("T")[0],
      });
    }
  }, [type, project]);

  // Error state
  const initialStateErrors = {
    title: { required: false },
    description: { required: false },
    category: { required: false },
    deadline: { required: false },
    custom_error: null,
  };
  const [errors, setErrors] = useState(initialStateErrors);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault(); 
    let error = initialStateErrors;
    let hasError = false;
    if (!inputs.title) {
      error.title.required = true;
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
    if (!inputs.deadline) {
      error.deadline.required = true;
      hasError = true;
    }

    if (!hasError) {
      setLoading(true);
      
      const apiCall = isAdd
        ? axios.post("project/update", inputs)
        : axios.post("project/store", inputs);

      apiCall.then((response)=>{
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
              <h2 className="text-center">{isAdd ? "Update Project" : "Add Project"}</h2>
              <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                <input
                    type="hidden"
                    className="form-control"
                    value={userdetails.id}
                    name="id"
                  />
                  <input
                    type="hidden"
                    className="form-control"
                    value={userdetails.token}
                    name="token"
                  />
                  <label htmlFor="title" className="text-uppercase">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={inputs.title}
                    onChange={handleInputs}
                    name="title"
                  />
                  {errors.title.required && (
                    <span className="text-danger">Title is required.</span>
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
                    value={isAdd ? "Update Project" : "Add Project"}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default FormDetails;
