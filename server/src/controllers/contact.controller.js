/* eslint-disable no-unused-vars */
import Contact from '../models/Contact.js'
import nodemailer from "nodemailer";

/* =========================================================
   EMAIL TRANSPORT CONFIGURATION
========================================================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/* =========================================================
   CREATE CONTACT (with email notification)
========================================================= */
// export const createContact = async (req, res, next) => {
//   try {
//     const contact = await Contact.create(req.body);

//     const mailOptions = {
//       from: process.env.EMAIL_USERNAME,
//       to: "ask7264ss@gmail.com",
//       subject: "New Contact Form Submission",
//       html: `
//         <h2>New Contact Details</h2>
//         <p><strong>Name:</strong> ${contact.name}</p>
//         <p><strong>Email:</strong> ${contact.email}</p>
//         <p><strong>Message:</strong> ${contact.message}</p>
//         <p><strong>Submitted at:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(201).json({ success: true, data: contact });
//   } catch (err) {
//     next(err);
//   }
// };


export const createContact = async (req, res, next) => {
  try {
    console.log("👉 Incoming contact data:", req.body); // ✅ LOG INPUT

    const contact = await Contact.create(req.body);
    console.log("✅ Saved contact:", contact); // ✅ LOG SAVED RESULT

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: "abhishekmeena9171@gmail.com",
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Details</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Message:</strong> ${contact.message}</p>
        <p><strong>Submitted at:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    console.error("❌ Error in createContact:", err.message); // ✅ LOG ERRORS
    next(err);
  }
};

/* =========================================================
   GET ALL CONTACTS
========================================================= */
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   GET CONTACT BY ID
========================================================= */
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   UPDATE CONTACT
========================================================= */
export const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   DELETE CONTACT
========================================================= */
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.json({ success: true, message: "Contact deleted" });
  } catch (err) {
    next(err);
  }
};
