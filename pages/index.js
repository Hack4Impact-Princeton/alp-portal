import Link from 'next/link'
import Navbar from '../components/Navbar'
import dbConnect from '../lib/dbConnect'
import Pet from '../models/Pet'
import SignUpBanner from '../components/SignUpBanner'
import { useEffect, useState } from 'react'
import useContentful from './useContentful'

function HomePage() {
  return (
    <div>
      <Navbar></Navbar>
      <div>Welcome to ALP Portal!</div>
    </div>
  );
}

/* Keep example code here, nothing should be dynamic on the home page */
export async function getServerSideProps() {
  await dbConnect()

  /* find all the data in our database */
  const result = await Pet.find({})
  const pets = result.map((doc) => {
    const pet = doc.toObject()
    pet._id = pet._id.toString()
    return pet
  })

  return { props: { pets: pets } }
}
/* end example pet code */

// export const Index
export default HomePage
