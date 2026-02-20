const axios = require('axios');

async function testAuth() {
    const user = {
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
        role: "user"
    };

    try {
        console.log("1. Registering User...");
        // Use a random email to avoid collision on repeated runs
        const randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
        const resReg = await axios.post('http://localhost:5000/auth/register', { ...user, email: randomEmail });
        console.log("Registration Success:", resReg.data);
        const token = resReg.data.token;

        console.log("\n2. Logging in User...");
        const resLogin = await axios.post('http://localhost:5000/auth/login', {
            email: randomEmail,
            password: user.password,
            role: "user"
        });
        console.log("Login Success:", resLogin.data);

    } catch (err) {
        console.error("Auth Test Failed:", err.response?.data || err.message);
        if (err.response?.data) console.error("Details:", err.response.data);
    }
}

testAuth();
