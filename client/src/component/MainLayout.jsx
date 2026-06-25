import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router'
import FooterSection from './Footer'

const MainLayout = () => {
  return (
<>
<Header></Header>
<Outlet></Outlet>
<FooterSection></FooterSection>
</>

)
}

export default MainLayout