// Import PrismaClient จาก @prisma/client เพื่อเชื่อมต่อและจัดการฐานข้อมูล
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // สร้าง instance ของ PrismaClient

module.exports = {
  // ฟังก์ชัน create ใช้เพื่อเพิ่มรายการใหม่ในตาราง foodType
  create: async (req, res) => {
    try {
      await prisma.foodType.create({
        data: {
          name: req.body.name, // รับค่าชื่อจาก body ของ request
          remark: req.body.remark, // รับค่า remark จาก body ของ request
          status: "use", // กำหนดค่าเริ่มต้นให้ status เป็น 'use'
        },
      });

      return res.send({ message: "success" }); // ส่งข้อความ success เมื่อเพิ่มข้อมูลสำเร็จ
    } catch (e) {
      return res.status(500).send({ error: e.message }); // ส่ง error message ถ้าเกิดข้อผิดพลาด
    }
  },

  // ฟังก์ชัน list ใช้เพื่อแสดงรายการ foodType ทั้งหมดที่มี status เป็น 'use'
  list: async (req, res) => {
    try {
      const rows = await prisma.foodType.findMany({
        where: {
          status: "use", // เงื่อนไขเลือกเฉพาะรายการที่ยังอยู่ในสถานะ 'use'
        },
        orderBy: {
          id: "desc", // จัดเรียงข้อมูลจาก id มากไปน้อย (ข้อมูลล่าสุดอยู่บนสุด)
        },
      });

      return res.send({ results: rows }); // ส่งข้อมูลที่ได้ออกไปในรูปแบบ JSON
    } catch (e) {
      return res.status(500).send({ error: e.message }); // ส่ง error message ถ้าเกิดข้อผิดพลาด
    }
  },

  // ฟังก์ชัน remove ใช้เพื่อเปลี่ยนสถานะรายการเป็น 'delete' (soft delete)
  remove: async (req, res) => {
    try {
      await prisma.foodType.update({
        data: {
          status: "delete", // เปลี่ยนสถานะเป็น 'delete' เพื่อแสดงว่าลบแล้ว
        },
        where: {
          id: parseInt(req.params.id), // ใช้ id จาก URL parameter เพื่อระบุตัวรายการที่ต้องการลบ
        },
      });

      return res.send({ message: "success" }); // ส่งข้อความ success เมื่อทำการลบข้อมูลสำเร็จ
    } catch (e) {
      return res.status(500).send({ error: e.message }); // ส่ง error message ถ้าเกิดข้อผิดพลาด
    }
  },

  // ฟังก์ชัน update ใช้เพื่อแก้ไขข้อมูลรายการ foodType
  update: async (req, res) => {
    try {
      await prisma.foodType.update({
        data: {
          name: req.body.name, // รับค่า name ที่จะอัปเดตจาก body ของ request
          remark: req.body.remark, // รับค่า remark ที่จะอัปเดตจาก body ของ request
        },
        where: {
          id: req.body.id, // ใช้ id จาก body ของ request เพื่อระบุตัวรายการที่ต้องการอัปเดต
        },
      });

      return res.send({ message: "success" }); // ส่งข้อความ success เมื่ออัปเดตข้อมูลสำเร็จ
    } catch (e) {
      return res.status(500).send({ error: e.message }); // ส่ง error message ถ้าเกิดข้อผิดพลาด
    }
  },
};