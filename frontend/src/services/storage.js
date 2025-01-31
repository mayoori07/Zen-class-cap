export const storeUserData=(data)=>{
    // console.log(data,'----- store user details')
    localStorage.setItem('userdetails',JSON.stringify({
        'id':data.id,
        'token': data.token
      }));
    }
export const getUserData=()=>{
    return (JSON.parse(localStorage.getItem('userdetails')));
}

export const RemoveUserData = () => {
    return localStorage.removeItem('userdetails')
}

export const UpdateUser = (data) => {
    localStorage.setItem('UpdateDetails',JSON.stringify({
        'id': data.id,
        'token': data.token
      }));
    }

export const UpdateGetData = () =>{
    return (JSON.parse(localStorage.getItem('UpdateDetails')));
}