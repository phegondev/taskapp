import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ApiService from "../api/ApiService"


const Register = () => {

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const [error, setError] = useState('')
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            setError("please fill in alll fields")
            return;
        }

        try {
            const res = await ApiService.registerUser(formData);
            if (res.statusCode === 200) {
                navigate("/login")
            } else {
                setError(res.message || "Registration not successful")
            }

        } catch (error) {
            setError(error.response?.data?.message || error.message)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h2>Register</h2>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password" />
                    </div>
                    <button type="submit" className="auth-button">
                        Register
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    )
}

export default Register;