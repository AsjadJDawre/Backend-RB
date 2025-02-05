import cron from 'node-cron';
import { User } from './models/user.model.js'; 
const resetRefillsQuota = async () => {
 
    console.log("hello this is the file to reset the 12 refills after 12 months duration ")
 
    try {
    // Get current date and check which users need their RefillsQuotaLeft reset
    const users = await User.find();

    // Iterate through all users
    for (const user of users) {
      const createdAt = new Date(user.createdAt); // Assuming createdAt is a timestamp
      const currentDate = new Date();
      
      // Calculate the difference in months between user registration and the current date
      const monthsDiff = (currentDate.getFullYear() - createdAt.getFullYear()) * 12 + (currentDate.getMonth() - createdAt.getMonth());

      // If 12 months have passed and the quota is 0, reset it to 12
      if (monthsDiff >= 12 && user.RefillsQuotaLeft === 0) {
        user.RefillsQuotaLeft = 12;
        await user.save(); // Save the updated user
        console.log(`User ${user.username}'s RefillsQuotaLeft has been reset.`);
      }
    }
  } catch (err) {
    console.error('Error resetting RefillsQuotaLeft:', err);
  }
};

// Schedule the cron job to run once a day at midnight (00:00)
cron.schedule('0 0 * * *', resetRefillsQuota); // The cron expression runs the job every day at midnight
