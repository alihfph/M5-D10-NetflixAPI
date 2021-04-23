import express from "express";
import { getStudents, writeStudents } from "../lib/fs-tools.js";
import uniqid from "uniqid";
import { check, validationResult } from "express-validator";
import { fstat } from "fs";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const review = await getStudents();

    if (req.query && req.query.name) {
      const filteredReview = review.filter(
        (review) =>
          review.hasOwnProperty("name") && student.name === req.query.name
      );
      res.send(filteredReview);
    } else {
      res.send(review);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:studentID/:id", async (req, res, next) => {
  try {
    const students = await getStudents();
    const student = [...students].filter(
      (a) => a.imBDid === req.params.studentID
    );
    console.log(student);
    const revieww = student[0].reviews.filter((a) => a.ID === req.params.id);
    res.send(revieww);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/:reviewID", async (req, res, next) => {
  try {
    const media = await getStudents();
    const newReview = { ...req.body, ID: uniqid(), createdAt: new Date() };
    // console.log(media);
    const filteredmedia = [...media].findIndex(
      (a) => a.imBDid === req.params.reviewID
    );

    console.log(filteredmedia);
    await media[filteredmedia].reviews.push(newReview);
    // reviews.push(newReview);
    await writeStudents(media, JSON.stringify(media));
    res.send(201, newReview);
  } catch (error) {
    console.log(error);
    error.httpStatusCode = 500;
    next(error);
  }
});

router.put("/:studentID/:id", async (req, res, next) => {
  try {
    const students = await getStudents();
    const student = [...students].filter(
      (a) => a.imBDid === req.params.studentID
    );
    const revieww = student[0].reviews.filter((a) => a.ID === req.params.id);

    const modifiedReview = {
      ...revieww,
      modifiedAt: new Date(),
    };
    const oldStuff = await getStudents();
    await writeStudents(...oldStuff, JSON.stringify(modifiedReview));
    // await writeStudents(modifiedReview, JSON.stringify(students));
    res.send(modifiedReview);
    // revieww.push(modifiedReview);
    // await writeStudents(revieww);

    // res.send(modifiedReview);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const reviews = await getStudents();

    const newReview = reviews.filter((review) => review.ID !== req.params.id);
    await writeStudents(newReview);
    res.status(204).send();
  } catch (error) {
    console.log(error);
  }
});

export default router;
