import React,{ useEffect } from "react";
import { Card, Button, Form, Input, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../../../Components/Assets/textLogo.png";
import { CREATE_jwel } from "../../../Config/Config";

const LoginPage = ({ onLogin }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("isLoggedIn") === "true") {
            navigate("/dashboard"); // Redirect to dashboard if already logged in
        }
    }, [navigate]);
    const onFinish = async (values) => {
        const { username, password } = values;
        try {
            const response = await fetch(
                `${CREATE_jwel}/api/Tenant/CheckValidTenantWithName?userName=${username}&password=${password}&clientName=MADHU`
            );
            const data = await response.json();
            if (data.tenantName) {
                localStorage.setItem("isLoggedIn", "true"); // Store login status
                onLogin();
                navigate("/dashboard");
            } else {
                console.log("Invalid username or password");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div
            className="login-page-container"
            style={{
                backgroundImage: "url('https://img.freepik.com/free-vector/abstract-dark-blue-vector-futuristic-digital-grid-background_53876-110562.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <div className="login-wrapper">
                {/* Left Section */}
                <div className="welcome-section">
                    <div className="welcome-content">
                        <img src={logo} alt="Logo" className="logo" />
                        <h2>Log-In</h2>
                        <p>Please log in to access your account</p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="login-section">
                    <Card bordered={false} className="login-card">
                        <h2>Login</h2>
                        <p>Log in to your account to continue</p>
                        <Form
                            name="login"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            layout="vertical"
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[{ required: true, message: "Please input your username!" }]}
                            >
                                <Input size="large" placeholder="Username" />
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: "Please input your password!" }]}
                            >
                                <Input.Password size="large" placeholder="Password" />
                            </Form.Item>
                            <Form.Item className="remember-forgot">
                                <Checkbox>Remember me</Checkbox>
                                <a href="/" className="forgot-password">
                                    Forgot password?
                                </a>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-button"
                                    size="large"
                                >
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
