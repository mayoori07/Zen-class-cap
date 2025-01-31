import { useState } from 'react';
import { Navigate , Link, useAsyncError,useNavigate} from 'react-router-dom';
import NavBar from '../components/NavBar';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import axios from "axios";
import { storeUserData, getUserData } from '../services/storage';
import { isAuthenticated } from '../services/Auth';

function LoginPage(){
    axios.defaults.baseURL = 'https://project-management-tool-server-16w1.onrender.com/api';
    const navigate = useNavigate();
    const userdetails = getUserData();
    const initialStateErrors={
        email:{required:false},
        password:{required:false},
        custom_error:null
    }
    const [errors,setErrors]=useState(initialStateErrors)

    const[loading,setLoading]=useState(false);
    const [inputs,setInputs] =useState({
        email:"",
        password:"",
    });
    const handleSubmit = (event) =>{
        event.preventDefault();
        let error = initialStateErrors;
        let hasError=false

        if(inputs.email==""){
            error.email.required=true;
            hasError=true;
        }
        if(inputs.password.length<4){
            error.password.required=true;
            hasError=true;
        }
        if(!hasError){
            setLoading(true)
            axios.post('/login',inputs).then((response)=>{
                if(response.data.status){
                  storeUserData(response.data);
                  axios.post(`https://project-management-tool-server-16w1.onrender.com/api/project/index`, {token: response.data.token,
                  })
                  .then((res) => {
                    navigate("/dashboard", {
                      state: { details: res.data.data },
                    });
                  }).catch((err) => {
                    console.log(err);
                  });      
                  navigate("/dashboard");
                }
                
            }).catch((err)=>{
                console.log(err);
            }).finally(()=>{
                setLoading(false);
            })
        }
        setErrors({...error})
    }
    const handleInputs = (event) =>{
        setInputs({...inputs,[event.target.name]:event.target.value})

    }
    if (isAuthenticated()) {
      const getdetail = getUserData();
      if (getdetail.token){
          return < Navigate to="/dashboard" />
      }
  }
  return (
    <>
      <NavBar />
      <section className="Auth-block">
        <div className="container mt-3">
          <form className="needs-validation" action="" onSubmit={handleSubmit} >
            <fieldset>
              <legend className="mb-4">Login</legend>

              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={handleInputs}
                  required
                />
                {errors.email.required?
                    (<span className="text-danger" >
                        Please provide your E-mail.
                    </span>):null
                }
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={handleInputs}
                  required
                />
                {errors.password.required?
                    (<span className="text-danger" >
                        Password should be at least 4 characters.
                    </span>):null
                }
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-success">
                  Login
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </section>
    </>
  );
}

export default LoginPage