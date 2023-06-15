import Link from 'next/link'
import {useSession} from 'next-auth/react'
type UnauthorizedProps = {
    url: string;
}

const Unauthorized: React.FC<UnauthorizedProps> = ({ url }) => {
    const {data} = useSession()
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "column", padding: "20px", margin: "10px" }}>
            <h1>{`You are not allowed to access ${url}`}</h1>
            {data && data.user && <h2>{`You are currently logged in as ${data.user.name}`}</h2>}
            <Link href='/auth/login'>Click here to login as a different user</Link>
        </div>
    )
}

export const getServerSideProps = async (context: any) => {
    const url: string = context.query.url
    return { props: { url: url}}
}

export default Unauthorized