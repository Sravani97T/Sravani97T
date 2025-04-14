import React, { useState } from "react";

const PhonePay = () => {
    const [amount, setAmount] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");

    const handlePayment = () => {
        if (!phoneNumber || !amount) {
            setMessage("Please enter all details.");
            return;
        }

        if (!/^\d{10}$/.test(phoneNumber)) {
            setMessage("Invalid phone number. Please enter a 10-digit number.");
            return;
        }

        if (isNaN(amount) || Number(amount) <= 0) {
            setMessage("Invalid amount. Please enter a valid number.");
            return;
        }

        // Generate UPI payment link
        const upiId = "your-upi-id@upi"; // Replace with your UPI ID
        const upiLink = `upi://pay?pa=${upiId}&pn=PhonePay&am=${amount}&cu=INR`;

        // Redirect to UPI link
        window.location.href = upiLink;

        setMessage(`Redirecting to payment of ₹${amount}...`);
        setAmount("");
        setPhoneNumber("");
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
            <h2>PhonePay</h2>
            <div style={{ marginBottom: "10px" }}>
                <label>Phone Number:</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter 10-digit phone number"
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Amount:</label>
                <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
            </div>
            <button
                onClick={handlePayment}
                style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Pay Now
            </button>
            {message && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "5px",
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default PhonePay;