import React, { Component } from 'react'
import loading from '../loding.gif'

const Spinner = () =>{
  
    return (
      <div className='text-center'>
        <img src={loading} alt="Loading"/>
      </div>
    )
}
export default Spinner
