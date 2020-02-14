const Question = require("../models/Question");

const askQuestion = (req, resp) => {
  const question = new Question(req.body);
  question.save((err, result) => {
    if (err) {
      console.log(err);
      resp.status(400).json(err);
    }
    resp.json(result);
  });
};

const getQuestion = (req, resp) => {
  console.log("REQ.QUERY", req.query);
  const category = req.query.category;

  if (category) {
    //Send back questions relating to category selected.
    Question.find({ category, is_pickedup: false })
      .sort("-createdAt")
      .populate("user_id", "user_email user_firstName")
      .exec((err, res) => {
        err ? resp.json(err) : resp.json(res);
      });
  } else {
    Question.find({ is_pickedup: false })
      .sort("-createdAt")
      .populate("user_id", "user_email user_firstName")
      .exec((err, res) => {
        err ? resp.json(err) : resp.json(res);
      });
  }
};

const getQuestionByUser = (req, resp) => {
  console.log("Question By User");
  let user_id = req.params.user_id;
  console.log(user_id);

  Question.find({ user_id: user_id }).exec((err, res) => {
    if (err) {
      console.log(err);
      resp.json(err);
    } else {
      resp.json(res);
    }
  });
};

// Gets question with a certain _id, when you are trying to answer it
// and loads all answers
const getQuestionByID = (req, resp) => {
  console.log("Accesing getQuestionByID function");
  const id = req.params._id;
  console.log(id);

  Question.findOne({ _id: id })
    .populate({
      path: "answer_id",
      populate: {
        path: "user_id",
        select: "user_username",
        model: "User"
      }
    })
    .populate("user_id", "user_username")
    .exec((err, docs) => {
      if (!err) {
        console.log(docs);
        resp.json(docs);
      } else {
        console.log(err);
        throw err;
      }
    });
};

module.exports = {
  askQuestion,
  getQuestion,
  getQuestionByID,
  getQuestionByUser
};
