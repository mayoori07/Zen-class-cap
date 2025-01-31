import { useState } from "react";
import { Navigate, Link, useNavigate } from 'react-router-dom';
import NavBar from "../components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { getUserData } from "../services/storage";
import { isAuthenticated } from "../services/Auth";

function RegisterPage() {
    axios.defaults.baseURL = 'https://project-management-tool-server-16w1.onrender.com/api';
    const navigate = useNavigate();
    const initialStateErrors={
        username:{required:false},
        email:{required:false},
        password:{required:false},
        confirm_Password:{required:false},
        custom_error:null
    }
    const [errors,setErrors]=useState(initialStateErrors)

    const[loading,setLoading]=useState(false);
    const [inputs,setInputs] =useState({
        username:"",
        email:"",
        password:"",
        confirm_Password:""
    });
    const handleSubmit = (event) =>{
        event.preventDefault();
        let error = initialStateErrors;
        let hasError=false
        if(inputs.username==""){
            error.username.required=true;
            hasError=true;
        }
        if(inputs.email==""){
            error.email.required=true;
            hasError=true;
        }
        if(inputs.password.length<4){
            error.password.required=true;
            hasError=true;
        }
        if(inputs.confirm_Password!=inputs.password){
            error.confirm_Password.required=true;
            hasError=true;
        }
        if(!hasError){
            setLoading(true)
            axios.post('/store',inputs).then((response)=>{
              if (response.data.status){
                navigate("/");
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
        setErrors({...error})
    }

    const handleInputs = (event) =>{
        setInputs({...inputs,[event.target.name]:event.target.value});
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
              <legend className="mb-4">Register</legend>
              <div className="mb-3">
                <label className="form-label" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="Enter username"
                  onChange={handleInputs}
                  required
                />
                {errors.username.required?
                    (<span className="text-danger" >
                        Username can contain any letters or numbers, without spaces.
                    </span>):null
                }
              </div>

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

              <div className="mb-3">
                <label className="form-label" htmlFor="password_confirm">
                  Password (Confirm)
                </label>
                <input
                  type="password"
                  id="password_confirm"
                  name="confirm_Password"
                  className="form-control"
                  placeholder="Confirm password"
                  onChange={handleInputs}
                  required
                />
                {errors.confirm_Password.required?
                    (<span className="text-danger" >
                        Please confirm your password.
                    </span>):null
                }
              </div>
              {errors.custom_error?
                  (<span className="text-danger" >
                        {errors.custom_error}
                  </span>):null
              }
              <div className="d-grid">
                <button type="submit" className="btn btn-success">
                  Register
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </section>
    </>
  );
}

export default RegisterPage;
