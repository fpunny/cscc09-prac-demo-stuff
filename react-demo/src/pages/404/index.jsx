import { Link } from "react-router-dom";
import Layout from "../../components/Layout";

function NotFound() {
    return (
        <Layout>
            <h1>Page not founds TwT</h1>
            <Link to='/'>Go backs</Link>
        </Layout>
    );
}

export default NotFound;