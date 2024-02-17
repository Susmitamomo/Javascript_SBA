// Function to calculate weighted average score for a learner
function calculateWeightedAverage(submissions, assignments) {
    let totalScore = 0;
    let totalPossible = 0;

    for (const assignment of assignments) {
        const submission = submissions.find(sub => sub.assignment_id === assignment.id);
        if (submission && new Date(submission.submission.submitted_at) <= new Date(assignment.due_at)) {
            // Deduct 10% if submission is late

            const latePenalty = new Date(submission.submission.submitted_at) > new Date(assignment.due_at) ? 0.1 : 0;
            const assignmentScore = submission.submission.score * (1 - latePenalty);
            totalScore += assignmentScore;
            totalPossible += assignment.points_possible;
        }
    }

    return totalPossible !== 0 ? totalScore / totalPossible : 0;

}


// Create the getLearnerData function
function getLearnerData(course, ag, submissions) {
    // Validate if assignment group belongs to the course
    if (ag.course_id !== course.id) {
        throw new Error("Invalid input: Assignment group does not belong to the specified course.");
    }

    const result = [];

    for (const submission of submissions) {
        const learnerID = submission.learner_id;
        const learnerData = result.find(data => data.id === learnerID);

        if (!learnerData) {
            const newLearnerData = {
                id: learnerID,
                avg: 0,
            };
            result.push(newLearnerData);
        }

        const currentLearnerData = result.find(data => data.id === learnerID);

        for (const assignment of ag.assignments) {
            try {
                const submissionData = submissions.find(sub => sub.assignment_id === assignment.id && sub.learner_id === learnerID);
                if (!submissionData) continue;

                const dueDate = new Date(assignment.due_at);
                const submissionDate = new Date(submissionData.submission.submitted_at);

                if (submissionDate > dueDate) {
                    // Deduct 10% if submission is late
                    const latePenalty = 0.1;
                    const adjustedScore = submissionData.submission.score * (1 - latePenalty);
                    currentLearnerData[assignment.id.toString()] = adjustedScore / assignment.points_possible;
                } else {
                    currentLearnerData[assignment.id.toString()] = submissionData.submission.score / assignment.points_possible;
                }
            } catch (error) {
                console.error(`Error processing assignment ${assignment.id}: ${error.message}`);
            }
        }

        currentLearnerData.avg = calculateWeightedAverage(submissions.filter(sub => sub.learner_id === learnerID), ag.assignments);
    }

    return result;
}

// Sample data
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        }
    ]
};

const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];

// Test the function
try {
    const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
    console.log("Learner Data");

    for (const learner of result) {
        console.log(`ID: ${learner.id}`);
        console.log(`Average Score: ${learner.avg.toFixed(3)}`);
        
        for (const assignment of AssignmentGroup.assignments) {
            console.log("Assignment" + " " + `${assignment.id}: ${learner[assignment.id.toString()].toFixed(3)}`);
        }
        
        console.log(""); // Add an empty line after each learner's data
    }
} catch (error) {
    console.error(error.message);
}



