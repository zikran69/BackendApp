const { prisma } = require("../../db");
const express = require("express");
const router = express.Router();

const login = async (req, res) => {
  try {
    const { userName, paswordCustomer } = req.body;
    return res.status(200).send({
      msgLogin: "login seccess...",
      data: req.body.customer,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const all = async (req, res) => {
  try {
    res.send({
      customer: await prisma.customer.findMany({
        include: {
          statusId: true,
          transaction: true,
        },
      }),
      message: "get customer success",
    });
  } catch (err) {
    // Memeriksa apakah kesalahan terkait validasi data
    if (err.name === "ValidationError") {
      res.status(400).send({
        error: "Invalid data",
        details: err.message,
      });
    } else {
      // Kesalahan umum lainnya
      res.status(500).send({
        error: "Internal Server Error",
        details: err.message,
      });
    }
  }
};

const add = async (req, res) => {
  try {
    const {
      userName,
      nameCustomer,
      nikCustomer,
      emailCustomer,
      tlpnCustomer,
      addressCustomer,
      fotoCustomer,
      paswordHashed,
      statusCustomer,
    } = req.body;
    await prisma.customer.create({
      data: {
        userName: userName,
        nameCustomer: nameCustomer,
        nikCustomer: nikCustomer,
        emailCustomer: emailCustomer,
        tlpnCustomer: tlpnCustomer,
        addressCustomer: addressCustomer,
        fotoCustomer: req.files[0].path,
        paswordCustomer: paswordHashed,
        statusCustomer: parseInt(statusCustomer),
      },
    });
    return res.status(200).send({ message: "add customer" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const customerId = async (req, res) => {
  try {
    return res.status(200).send({
      customerId: await prisma.customer.findUnique({
        where: { idCustomer: parseInt(req.params.id) },
      }),
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const del = async (req, res) => {
  try {
    const idCustomer = parseInt(req.params.id);
    await prisma.customer.delete({
      where: { idCustomer: idCustomer },
    });
    return res.status(200).send({ message: "deleted" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const idCustomer = parseInt(req.params.id);
    const {
      userName,
      nameCustomer,
      nikCustomer,
      emailCustomer,
      tlpnCustomer,
      addressCustomer,
      fotoCustomer,
      paswordHashed,
      statusCustomer,
    } = req.body;
    await prisma.customer.update({
      where: { idCustomer: idCustomer },
      data: {
        userName: userName,
        nameCustomer: nameCustomer,
        nikCustomer: nikCustomer,
        emailCustomer: emailCustomer,
        tlpnCustomer: tlpnCustomer,
        addressCustomer: addressCustomer,
        fotoCustomer: fotoCustomer,
        paswordCustomer: paswordHashed,
        statusCustomer: parseInt(statusCustomer),
      },
    });
    return res.status(200).send({ message: "updated" });
  } catch (error) {
    return req.status(500).send({ message: error.message });
  }
};

module.exports = { login, all, add, customerId, del, update };
