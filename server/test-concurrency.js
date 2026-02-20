const axios = require('axios');

async function testConcurrency() {
    const expertId = "REPLACE_WITH_REAL_ID"; // We need an ID. 
    // Actually, let's just fetch one first.
    
    try {
        const experts = await axios.get('http://localhost:5000/experts');
        if (experts.data.experts.length === 0) {
            console.log("No experts found to test.");
            return;
        }
        
        const expert = experts.data.experts[0];
        const slot = expert.slots.find(s => !s.isBooked);
        
        if (!slot) {
            console.log("No available slots to test.");
            return;
        }

        console.log(`Testing concurrency on Expert: ${expert.name}, Slot: ${slot.time}`);

        const requests = [];
        for (let i = 0; i < 5; i++) {
            requests.push(axios.post('http://localhost:5000/bookings', {
                expertId: expert._id,
                userEmail: `test${i}@example.com`,
                userName: `Tester ${i}`,
                userPhone: "1234567890",
                date: slot.date,
                timeSlot: slot.time,
                notes: "Concurrency Test"
            }).catch(e => e.response));
        }

        const results = await Promise.all(requests);
        
        let successCount = 0;
        let failCount = 0;

        results.forEach((res, index) => {
            if (res.status === 201) {
                console.log(`Request ${index}: SUCCESS`);
                successCount++;
            } else {
                console.log(`Request ${index}: FAILED (${res.status} - ${res.data?.message})`);
                failCount++;
            }
        });

        console.log(`\nResults: ${successCount} Success, ${failCount} Failed`);
        
        if (successCount === 1 && failCount === 4) {
            console.log("PASSED: Double booking prevented.");
        } else {
            console.log("FAILED: Double booking occurred or all failed.");
        }

    } catch (err) {
        console.error("Setup failed:", err.message);
    }
}

// Wait for server to start if running immediately
setTimeout(testConcurrency, 2000);
