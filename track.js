<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Tracker</title>
    <script>
        // Store the current session's start time
        const sessionStartTime = new Date().getTime();
        
        // Track user data when they leave the website
        window.addEventListener('beforeunload', function () {
            const sessionEndTime = new Date().getTime();
            const sessionDuration = (sessionEndTime - sessionStartTime) / 1000; // Time in seconds

            const userData = {
                timestamp: new Date().toISOString(),
                sessionDuration: sessionDuration, // Duration in seconds
                userId: Math.random().toString(36).substring(2) // Random unique user ID
            };

            // Send the data to the server (assuming backend endpoint "/track")
            fetch('/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            }).catch(error => {
                console.error('Error tracking user data:', error);
            });
        });
    </script>
</head>
<body>
</body>
</html>
