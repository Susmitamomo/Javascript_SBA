Components
1.calculateWeightedAverage Function: This function calculates the weighted average score for a learner based on their submissions and assignment details. It considers late submissions and applies a 10% penalty if a submission is late.

2.getLearnerData Function: This function processes the learner data for a given course and assignment group. It validates that the assignment group belongs to the specified course and then iterates over learner submissions to compute their scores. It also calculates the average score for each learner.

3.Sample Data: The code includes sample data for the course, assignment group, and learner submissions. This data is used to test the getLearnerData function.


Functionality
1.The code calculates and displays learner data, including their IDs, average scores, and individual assignment scores.
2.It handles cases where learners have submitted assignments late and applies penalties accordingly.
3.Error handling is implemented using try/catch blocks to catch any potential errors during data processing.




