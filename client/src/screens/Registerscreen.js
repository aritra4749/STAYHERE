import React,{useState,useEffect} from 'react'
import axios from 'axios'
import Loading from '../components/Loading';
import Error from '../components/Error';
import Success from '../components/Success';
function Registerscreen(){
    const[name,setname]=useState();
    const[email,setemail]=useState();
    const[password,setpassword]=useState();
    const[cpass,setcpass]=useState();

    const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [success,setsuccess]=useState()
    async function register(){
        if(password==cpass)
{
    const user={name,email,password,cpass}

    try{
        setLoading(true)
        const result=(await axios.post('/api/users/register',user)).data
        setLoading(false)
        setsuccess(true)

        setname('')
        setemail('')
        setpassword('')
        setcpass('')
    }catch(error){
console.log(error);
setLoading(false)
setError(true)
    }
}
else{
    alert("password not matched");
}
    }
  return (
    <div>
    {loading && (<Loading/>)}
    {error && (<Error/>)}
    
        <div className='row justify-content-center mt-5'>
            <div className='col-md-5 mt-5'>
            {success && (<Success message='Registration success'/>)}
                <div className='bs'>
                    <h2 style={{textAlign:'center'}}><b>Register</b></h2>
                    <input type='text' className='form-control' placeholder='name' value={name} onChange={(e)=>{setname(e.target.value)}}></input>
                    <input type='text' className='form-control' placeholder='email' value={email} onChange={(e)=>{setemail(e.target.value)}}></input>
                    <input type='password' className='form-control' placeholder='password' value={password} onChange={(e)=>{setpassword(e.target.value)}}></input>
                    <input type='password' className='form-control' placeholder='confirm password' value={cpass} onChange={(e)=>{setcpass(e.target.value)}}></input>

                    <div className="d-flex justify-content-center mt-3">
                            <button className="btn btn-primary" onClick={register}>Register</button>
                        </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Registerscreen