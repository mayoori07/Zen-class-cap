const Project = require('./../models/project.model');
const User = require('./../models/user.model');
const Task = require('./../models/task.model');

exports.index = async (req, res) => {
    try {
        const token = req.body.token;
        const user = await User.findOne({ access_token: token });
        const list = await Project.find({ creatorId: user.id });
        res.json({
            status: true,
            message: 'success',
            data: list,
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
        const title = req.body.title;
        const description = req.body.description;
        const category = req.body.category;
        const deadline = req.body.deadline;
        const user = await User.findOne({ access_token: token });
        const project = new Project({
            title: title,
            description: description,
            category: category,
            deadline: deadline,
            creatorId: user.id,
        });
        await project.save();
        res.json({
            status: true,
            id: user.id,
            project: project,
            message: 'Project Added!',
        });
    } catch (err) {
        res.json({
            status: false,
            message: 'Whoops!!!',
            error: err
        });
    }
};

exports.show = async (req, res) => {
    try {
        const token = req.body.token;
        const projectId = req.body.project_id;
        const user = await User.findOne({ access_token: token });
        const pro = await Project.findOne({ _id: projectId }).populate("creatorId");
        const tasks = await Task.find({ projectId: projectId }).populate("projectId").populate("userId").populate("creatorId");
        res.json({
            status: true,
            message: 'success',
            project: pro,
            tasks: tasks,
        });
    } catch (err) {
        res.json({
            status: false,
            message: 'Whoops!!!',
            error: err
        });
    }
};

exports.update = async (req, res) => {
    try {
        const token = req.body.token;
        const id = req.body.id;
        const title = req.body.title;
        const description = req.body.description;
        const category = req.body.category;
        const deadline = req.body.deadline;
        const user = await User.findOne({ access_token: token });
        const project = await Project.updateOne(
            { _id: id },
            {
                $set: {
                    title: title,
                    description: description,
                    category: category,
                    deadline: deadline,
                }
            },
            { runValidators: true }
        );
        res.json({
            status: true,
            project: project,
            message: 'Project updated!',
        });
    } catch (err) {
        res.json({
            status: false,
            message: 'Whoops!!!',
            error: err
        });
    }
};

exports.destroy = async (req, res) => {
    try {
        const id = req.body.id;
        const pro = await Project.findOne({ _id: id });
        if (pro == null) {
            res.json({
                status: false,
                message: 'Project Missing!',
            });
        } else {
            const del = await Project.deleteOne({ _id: id });
            res.json({
                status: true,
                message: 'Project Deleted!',
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