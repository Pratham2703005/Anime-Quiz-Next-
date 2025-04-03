'use client';
import HomePage from '@/pages/homepage';
import Login from '@/pages/login'
import { useUserStore } from '@/store/userStore';
import React from 'react'

const Home = () => {
  const user = useUserStore((state)=>state.user);
  
  return (

    <div>
      { user? <HomePage/> :  <Login/> }

    </div>
  )
}

export default Home


