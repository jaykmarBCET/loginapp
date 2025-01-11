import { useState, useEffect, useContext } from 'react';
import { register, isValidUserName } from '../api/user.routes';
import Loading from './Loading';
import { AppContext } from '../context/AppProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        avatar: null,
        coverImage: null,
    });

    const { user } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [usernameIsValid, setUsernameIsValid] = useState({ statusCode: 0, message: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    useEffect(() => {
        const checkUsername = async () => {
            if (formData.username.length >= 7) {
                try {
                    const data = await isValidUserName({ username: formData.username });
                    setUsernameIsValid(data);
                } catch (error) {
                    toast.error(error.message);
                }
            } else {
                setUsernameIsValid({ statusCode: 0, message: '' });
            }
        };
        checkUsername();
    }, [formData.username]);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, avatar, coverImage } = formData;

        // Basic validation checks
        if (!name || !isValidEmail(email) || password.length < 8 || !avatar || !coverImage || usernameIsValid.statusCode !== 200) {
            setErrorMessage('Please ensure all fields are correctly filled.');
            toast.warn('All fields are required');
            return;
        }

        const submissionData = new FormData();
        Object.entries(formData).forEach(([key, value]) => submissionData.append(key, value));

        try {
            setLoading(true);
            toast.info("Please wait for registration",{authoClose:1000})
            toast.info('Please wait, registering...');
            const response = await register(submissionData);
            if(response.statusCode===201){
                toast.success("Register successful")
                navigate('/login')
                
            }else{
                toast.error("Register faild please try again")
            }

            // Reset form data after successful registration
            setFormData({
                username: '',
                name: '',
                email: '',
                password: '',
                avatar: null,
                coverImage: null,
            });
            setErrorMessage('');
        } catch (error) {
            console.error('Error registering user', error);
            setErrorMessage('Registration failed. Please try again.');
            toast.error('Registration failed, please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (user.email) {
        return <Navigate to="/" />;
    }

    return loading ? (
        <Loading />
    ) : (
        <div className="register-card mx-auto">
            <p className="pb-3 absolute">{usernameIsValid.message || errorMessage}</p>
            <h1 className="register-heading font-semibold text-center text-2xl py-4">Register</h1>
            <form onSubmit={handleSubmit} className="p-4 flex flex-col justify-center items-center gap-2" encType="multipart/form-data">
                {['name', 'email', 'username', 'password'].map((field, idx) => (
                    <input
                        key={idx}
                        onChange={handleChange}
                        placeholder={`Enter ${field}`}
                        name={field}
                        type={field === 'password' ? 'password' : 'text'}
                        className={`bg-transparent text-center outline-none px-4 py-2 font-semibold ${
                            field === 'username' && (usernameIsValid.message === 'Username is available' ? 'text-green-500' : 'text-red-500')
                        }`}
                    />
                ))}
                {['coverImage', 'avatar'].map((field, idx) => (
                    <label key={idx} className="custom-file-upload">
                        <p>Upload {field === 'coverImage' ? 'Cover Image' : 'Avatar Image'}:</p>
                        <input onChange={handleChange} type="file" name={field} />
                    </label>
                ))}
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow-xl" disabled={loading}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
