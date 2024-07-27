import React from 'react'
import {Link} from 'react-router-dom'

const Landingscreen = () => {
  return (
    <div className='row landing justify-content-center'>
        <div className='col-md-12 text-center'>
            <h2 style={{color:'white',fontSize:'130px'}}>STAYHERE</h2>
            <h1 style={{color:'white'}}>Live The Good Life In Luxurious Hotels</h1>
            <Link to='/home'>
            <button className='btn landing-btn'>Get Started</button>
            </Link>
        </div>
    </div>
  )
}

export default Landingscreen