var Project = require('mongoose').model('Project');

exports.getProjects = function(req, res) {
    var status = req.params.status;
    Project.find({Status: {$lt:status}})
        .sort({ProjNo:1})
        .exec(function(err, collection) {
        res.send(collection);
    })
};

exports.getProjectList = function(req, res) {
    var status = req.params.status;
    Project.find({Status: {$lt:status}}, {ProjNo:true, Title:true, Champion:true, Site:true, PROJCD:true, PROJTD:true, Status:true })
        .sort({ProjNo:1})
        .exec(function(err, collection) {
        res.send(collection);
    })
};

exports.updateProject = function(req, res) {
    Project.update({ProjNo:req.params.id}, {$set: req.body}, function (err, data) {
        if (err) return handleError(err);
        res.send(data);
    });
};


exports.deleteProject = function(req, res) {
    Project.remove({ProjNo:req.params.id}, function (err) {
        if (err) return handleError(err);
        res.send(200);
    });
};

exports.createProject = function(req, res, next) {
    var newNum = '';
    var new_date = new Date();
    var yr = new_date.getFullYear().toString().substr(2, 2);
    var search = new RegExp("P" + yr);

    var cnt = Project.count({ProjNo: search}).exec(function (err, count) {
        if (err) return err.toString();

        newNum = "P" + ((yr * 10000) + (count + 1));

        req.body.ProjNo = newNum;

        console.log(newNum);

        //var project = new Project(req.body);

    Project.create(req.body, function(err) {
        if(err) {
            if(err.toString().indexOf('E11000') > -1) {
                err = new Error('Duplicate Username');
            }
            res.status(400);
            return res.send({reason:err.toString()});
        }
        res.status(200).send(req.body);
        });
    });
};

exports.getProjectById = function(req, res) {
    Project.findOne({ProjNo:req.params.id}).exec(function(err, project) {
        res.send(project);
    })
};

exports.getProjectNameById = function(req, res) {
    Project.findOne({ProjNo:req.params.id}, {ProjNo:true, Title:true, _id:false}).exec(function(err, project) {
        res.send(project);
    })
};
