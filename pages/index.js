import Link from 'next/link'
import dbConnect from '../lib/dbConnect'
import Pet from '../models/Pet'

function HomePage() {
  return <div>Welcome to ALP Portal!</div>
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
