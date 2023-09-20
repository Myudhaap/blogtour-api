import express from "express";
import Tour from "../models/Tour.mjs";
import mongoose from "mongoose";

export const createTour = async (req, res) => {
  const tour = req.body;
  const newTour = new Tour({
    ...tour,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newTour.save();
    return res.status(201).json(newTour);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong on create tour" });
  }
};

export const getTours = async (req, res) => {
  const { page } = req.query;
  try {
    // const tours = await Tour.find({}).lean().exec();
    // return res.status(200).json(tours);

    const limit = 6;
    const startIndex = (Number(page) - 1) * limit;
    const total = await Tour.countDocuments({});
    const tours = await Tour.find().limit(limit).skip(startIndex);
    return res.status(200).json({
      data: tours,
      currentPage: Number(page),
      totalTours: total,
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong on get Tours" });
  }
};

export const getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id).lean().exec();
    return res.status(200).json(tour);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong on get tour" });
  }
};

export const getToursByUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const userTours = await Tour.find({ creator: id }).exec();
    return res.status(200).json(userTours);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong on get tour by user" });
  }
};

export const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No tour exist with id : ${id}` });
    }
    await Tour.findByIdAndRemove(id);
    return res.status(200).json({ message: "Tour deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong on delete user" });
  }
};

export const updateTour = async (req, res) => {
  const { id } = req.params;
  const { title, description, creator, imageFile, tags } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No tour exist with id : ${id}` });
    }
    const updatedTour = {
      creator,
      title,
      description,
      imageFile,
      tags,
      _id: id,
    };
    await Tour.findByIdAndUpdate(id, updatedTour, { new: true });
    return res.status(200).json(updatedTour);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong on update user" });
  }
};

export const getToursBySearch = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    console.log(title);
    const tours = await Tour.find({ title });
    res.status(200).json(tours);
  } catch (err) {
    console.log("hahahah");
    res.status(400).json({ message: "Something went wrong" });
  }
};

export const getToursByTag = async (req, res) => {
  const { tag } = req.params;
  try {
    const tours = await Tour.find({ tags: { $in: tag } });
    res.status(200).json(tours);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong on get tours by tag" });
  }
};

export const getRelatedTours = async (req, res) => {
  const tags = req.body;
  try {
    const tours = await Tour.find({ tags: { $in: tags } });
    res.status(200).json(tours);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong on get related tours" });
  }
};

export const likeTour = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.userId) {
      return res.json({ message: "User is not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No tour exist with id: ${id}` });
    }

    const tour = await Tour.findById(id);

    const index = tour.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
      tour.likes.push(req.userId);
    } else {
      tour.likes = tour.likes.filter((id) => id !== String(req.userId));
    }

    const updatedTour = await Tour.findByIdAndUpdate(id, tour, { new: true });

    res.status(200).json(updatedTour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
