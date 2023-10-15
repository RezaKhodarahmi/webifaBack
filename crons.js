const cron = require("node-cron");
const Enrollments = require("../../../../../models").Enrollments;

async function checkAndExpireEnrollments() {
  try {
    // Assuming you have cycle and user defined somewhere in your code
    const EnRolled = await Enrollments.findOne({
      where: { cycleId: cycle.id, userId: user.user },
    });

    if (EnRolled) {
      const currentDate = new Date();
      const enrollmentDate = new Date(EnRolled.enrollmentDate);

      if (enrollmentDate < currentDate) {
        EnRolled.status = 0;
        await EnRolled.save();
      }
    } else {
    }
  } catch (error) {
    console.error("Error checking and expiring enrollments:", error);
  }
}
// Schedule tasks to be run on the server.
cron.schedule("0 0 * * *", function () {
  // This will run every day at midnight
  checkAndExpireEnrollments();
});
