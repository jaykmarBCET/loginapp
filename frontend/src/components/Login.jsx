import { login } from '../api/user.routes';
import Loading from './Loading';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppProvider';
import { Navigate } from 'react-router-dom';
import {toast} from 'react-toastify'


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Loader, setLoader] = useState(false);
    const [error, setError] = useState('');
    
    const { user, setUser } = useContext(AppContext);

    const checkEmail = (str) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(str.length<=7){
            toast.error("Please enter valid username")
        }
        return regex.test(str);
    };

    const data = () => {
        if (email && password) {
            return { 
                email: checkEmail(email) ? email : undefined, 
                username: !checkEmail(email) ? email : undefined, 
                password 
            };
        } else {
            toast.error("All fields are required");
            return null; // Ensure that null is returned if validation fails
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const loginData = data();
        if (!loginData) return; 

        try {
            setLoader(true);
            toast.info("Pending, wait for login",{
                autoClose:500
            })
            const response = await login(loginData);
            if (response?.statusCode === 200) {
                setUser({
                    email: response.data.email,
                    id: response.data._id,
                    avatar: response.data.avatar,
                    name: response.data.name,
                    coverImage: response.data.coverImage,
                    createAt: response.data.createAt,
                    updateAt: response.data.updateAt,
                });
                toast.success("Login successfully")
                
            } else {
                setError("Login failed. Please check your credentials.");
                toast.error("Login failed ")
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
            toast.warn("Please check you password")
            console.log(error.message);
        } finally {
            setLoader(false);
        }
    };

    return (
        <>
            {user?.email ? (
                <Navigate to="/" />
            ) : (
                <div className='register-card flex flex-col mx-auto justify-center items-center'>
                    {Loader && <Loading />}
                    <h1 className='register-heading font-semibold text-center text-2xl py-4'>Login</h1>
                    {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
                    <form className='p-4 flex flex-col justify-center items-center gap-2' onSubmit={handleSubmit}>
                        <div>
                            <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder='Enter email or username' 
                                className='bg-transparent text-center outline-none px-4 py-2 font-semibold' 
                                type='text' // Change type to text to accept both email and username
                                name='email' 
                            />
                        </div>
                        <div>
                            <input 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder='Enter password' 
                                type='password' // Set type to password to hide input
                                className='bg-transparent text-center outline-none px-4 py-2 font-semibold' 
                                name='password' 
                            />
                        </div>
                        <div className="mt-5">
                            <button className='btn bg-blue-500 px-10 py-2 cursor-pointer' type="submit">
                                Login
                            </button>
                        </div>
                    </form>
                    
                </div>
            )}
        </>
    );
};

export default Login;
