import React,{useState,useEffect} from 'react'
import axios from 'axios'
import Loading from '../components/Loading';
import Error from '../components/Error';
function Loginscreen(){
    const[email,setemail]=useState();
    const[password,setpassword]=useState();
    const [loading, setLoading] = useState();
    const [error, setError] = useState(false);
    async function login(){
        
    const user={email,password}
    try{
        setLoading(true)
        const result=(await axios.post('/api/users/login',user)).data
        setLoading(false)
        localStorage.setItem('currentUser',JSON.stringify(result))
        window.location.href='/home'
    }catch(error){
console.log(error);
setLoading(false)
setError(true)
    }

    }
  return (
    <div>
    {loading && (<Loading/>)}
    
        <div className='row justify-content-center mt-5'>
            <div className='col-md-5 mt-5'>
            {error && (<Error message='Invalid Credentials'/>)}
                <div className='bs'>
                    <h2 style={{textAlign:'center'}}><b>Login</b></h2>
                    <input type='text' className='form-control' placeholder='email' value={email} onChange={(e)=>{setemail(e.target.value)}}></input>
                    <input type='password' className='form-control' placeholder='password' value={password} onChange={(e)=>{setpassword(e.target.value)}}></input>

                    <div className="d-flex justify-content-center mt-3">
                            <button className="btn btn-primary" onClick={login}>Login</button>
                        </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Loginscreen