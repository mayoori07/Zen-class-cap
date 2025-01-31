const Project = require('./../models/project.model');
const User = require('./../models/user.model');
const Task = require('./../models/task.model');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('id username');
        res.json({
            status: true,
            message: 'success',
            data: users,
        });
    } catch (err) {
        res.json({
            status: false,
            message: 'Whoops!!!',
            error: err
        });
    }
};

exports.store = async (req, res) => {
    try {
        const token = req.body.token;
        const projectId = req.body.project_id;
        const userId = req.body.user_id;
        const task = req.body.task;
        const description = req.body.description;
        const category = req.body.category;
        const deadline = req.body.deadline;
        const cost = req.body.cost;
        const currency = req.body.currency;
        const leader = await User.findOne({ access_token: token });
        const taskWork = new Task({
            projectId: projectId,
            userId: userId,
            task: task,
            description: description,
            category: category,
            deadline: deadline,
            cost: cost,
            currency: currency,
            creatorId: leader.id,
            status: 'pending'
        });
        await taskWork.save();
        res.json({
            status: true,
            message: 'Task Added!',
        });
    } catch (err) {
        res.json({
            status: false,
            message: 'Whoops!!!',
            error: err
        });
    }
};

exports.myTasks = async (req, res) => {
    try {
        token = req.body.token;
        const user = await User.findOne({ access_token: token });
        const tasks = await Task.find({ userId: user._id });
        res.json({
            status: true,
            message: 'success',
            tasks: tasks
        });
    } catch (err) {
        res.json({
            status: false,
            message: 'Whoops!!!',
            error: err
        });
    }
};

exports.updateComplete = async (req, res) => {
    try {
        const id = req.body.id;
        const task = await Task.findOne({ _id: id });
        if (task == null) {
            res.json({
                status: true,
                message: 'Task does not Exists!',
            });
        } else {
            await Task.updateOne(
                { _id: id },
                { $set: { status: 'complete' } },
                { runValidators: true }
            );
            res.json({
                status: true,
                message: 'Task Completed!',
            });
        }
    } catch (err) {
        res.json({
            status: false,
            message: 'Whoops!!!',
            error: err
        });
    }
};